// lib/cloudinary.ts
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { getEmbedding, cosineSimilarity } from "./embeddings";
import OpenAI from "openai";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SIMILARITY_THRESHOLD = 0.75;

function isMonsterImage(publicId: string): boolean {
  const id = publicId.toLowerCase();
  return /(^|[_\-/])monster([_\-/]|$)/.test(id);
}

export async function fetchImagesFromCloudinary(
  style: "default" | "monster" = "default"
) {
  const { resources } = await cloudinary.v2.api.resources({
    type: "upload",
    prefix: "pecs/",
    max_results: 200,
    context: true,
  });

  return resources
    .filter((img) => {
      const monster = isMonsterImage(img.public_id);
      return style === "monster" ? monster : !monster;
    })
    .map((img) => ({
      name: img.public_id.replace("pecs/", "").toLowerCase(),
      url: img.secure_url,
      public_id: img.public_id,
      description: img.context?.custom?.alt || img.public_id,
    }));
}

export async function fetchBestPecsImagesWithFallback(
  pages: string[],
  style: "default" | "monster" = "default"
): Promise<
  Record<
    string,
    {
      url: string;
      source: string;
      alt?: string;
      title?: string;
    }
  >
> {
  const primaryImages = await fetchImagesFromCloudinary(style);
  const fallbackImages =
    style === "monster" ? await fetchImagesFromCloudinary("default") : [];

  const results: Record<
    string,
    { url: string; source: string; alt?: string; title?: string }
  > = {};
  const usedImageUrls = new Set<string>();

  const embedAll = async (imgs: typeof primaryImages) =>
    Promise.all(
      imgs.map(async (img) => ({
        ...img,
        embedding: await getEmbedding(img.description || img.name),
      }))
    );

  const primaryEmbeddings = await embedAll(primaryImages);
  const fallbackEmbeddings = await embedAll(fallbackImages);

  for (let i = 0; i < pages.length; i++) {
    const text = pages[i];
    const textEmbedding = await getEmbedding(text);

    let bestMatch = null;
    let bestSim = -1;

    for (const img of [...primaryEmbeddings, ...fallbackEmbeddings]) {
      const sim = cosineSimilarity(textEmbedding, img.embedding);
      if (
        sim > bestSim &&
        sim >= SIMILARITY_THRESHOLD &&
        !usedImageUrls.has(img.url)
      ) {
        bestMatch = img;
        bestSim = sim;
      }
    }

    if (bestMatch) {
      usedImageUrls.add(bestMatch.url);
      results[i.toString()] = {
        url: bestMatch.url,
        source: "cloudinary",
        alt: bestMatch.description,
        title: bestMatch.name,
      };
      continue;
    }

    try {
      const prompt = {
        task: "Create a PECS-style educational image.",
        style: {
          type: "PECS (Picture Exchange Communication System)",
          reference:
            "https://nationalautismresources.com/the-picture-exchange-communication-system-pecs/",
          visual_description:
            "Flat, vector-based, minimalistic design with bold black outlines, solid colors, minimal internal detail, and child-friendly iconography. High contrast for accessibility.",
        },
        output: {
          formats: ["PNG"],
          dimensions: "512x512",
          transparent_background: true,
          optimize_for_contrast: true,
        },
        content: {
          image_subject: style === "monster" ? `Monster ${text}` : text,
          scene_guidance:
            style === "monster"
              ? `Depict "${text}" using a cute, child-safe cartoon monster character performing the action. The monster should be colorful, friendly, and easily readable in PECS style.`
              : `Clearly depict "${text}" as a singular, child-friendly action or object.`,
        },
        metadata: {
          title: text.slice(0, 60),
          alt: `PECS-style visual showing: ${text}`,
          description: `Educational image supporting communication about: ${text}`,
          tags:
            style === "monster"
              ? ["pecs", "communication", "autism", "monster"]
              : ["pecs", "communication", "autism"],
          category: "story",
          lang: "en",
        },
      };

      const aiResp = await openai.images.generate({
        model: "dall-e-3",
        prompt: JSON.stringify(prompt),
        size: "512x512",
        quality: "standard",
        n: 1,
      });

      const url = aiResp.data?.[0]?.url;
      results[i.toString()] = url
        ? {
            url,
            source: "openai",
            alt: prompt.metadata.alt,
            title: prompt.metadata.title,
          }
        : {
            url: "https://via.placeholder.com/512?text=No+Image",
            source: "placeholder",
            alt: "Placeholder image",
            title: "Missing image",
          };
    } catch {
      results[i.toString()] = {
        url: "https://via.placeholder.com/512?text=No+Image",
        source: "placeholder",
        alt: "Placeholder image",
        title: "Missing image",
      };
    }
  }

  return results;
}
