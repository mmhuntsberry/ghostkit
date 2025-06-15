// lib/cloudinary.ts

import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { getEmbedding, cosineSimilarity } from "./embeddings";
import OpenAI from "openai";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SIMILARITY_THRESHOLD = 0.75;

/** Raw Cloudinary resource shape */
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  context?: {
    custom?: { alt?: string };
  };
}

/** Normalized image data including description */
interface FetchedImage {
  name: string;
  url: string;
  public_id: string;
  description: string;
  embedding?: number[];
}

function isMonsterImage(publicId: string): boolean {
  const id = publicId.toLowerCase();
  return /(^|[_\-/])monster([_\-/]|$)/.test(id);
}

/**
 * Fetch images from Cloudinary under "pecs/" and filter by style.
 */
export async function fetchImagesFromCloudinary(
  style: "default" | "monster" = "default"
): Promise<FetchedImage[]> {
  const response = await cloudinary.v2.api.resources({
    type: "upload",
    prefix: "pecs/",
    max_results: 200,
    context: true,
  });

  const resources: CloudinaryResource[] =
    response.resources as CloudinaryResource[];

  return resources
    .filter((img: CloudinaryResource) => {
      const monster = isMonsterImage(img.public_id);
      return style === "monster" ? monster : !monster;
    })
    .map(
      (img: CloudinaryResource): FetchedImage => ({
        name: img.public_id.replace("pecs/", "").toLowerCase(),
        url: img.secure_url,
        public_id: img.public_id,
        description: img.context?.custom?.alt ?? img.public_id,
      })
    );
}

/**
 * Semantic search with Cloudinary images + OpenAI fallback.
 */
export async function fetchBestPecsImagesWithFallback(
  pages: string[],
  style: "default" | "monster" = "default"
): Promise<
  Record<string, { url: string; source: string; alt?: string; title?: string }>
> {
  const primaryImages = await fetchImagesFromCloudinary(style);
  const fallbackImages =
    style === "monster" ? await fetchImagesFromCloudinary("default") : [];

  const usedUrls = new Set<string>();

  // Helper to compute embeddings on an array of images
  async function embedAll(imgs: FetchedImage[]): Promise<FetchedImage[]> {
    return Promise.all(
      imgs.map(async (img: FetchedImage) => ({
        ...img,
        embedding: await getEmbedding(img.description),
      }))
    );
  }

  const primaryEmb = await embedAll(primaryImages);
  const fallbackEmb = await embedAll(fallbackImages);

  const results: Record<
    string,
    { url: string; source: string; alt?: string; title?: string }
  > = {};

  for (let i = 0; i < pages.length; i++) {
    const text = pages[i];
    const textEmbedding = await getEmbedding(text);

    let bestMatch: FetchedImage | null = null;
    let bestSim = -Infinity;

    for (const img of [...primaryEmb, ...fallbackEmb]) {
      const sim = cosineSimilarity(textEmbedding, img.embedding!);
      if (
        sim > bestSim &&
        sim >= SIMILARITY_THRESHOLD &&
        !usedUrls.has(img.url)
      ) {
        bestMatch = img;
        bestSim = sim;
      }
    }

    if (bestMatch) {
      usedUrls.add(bestMatch.url);
      results[i.toString()] = {
        url: bestMatch.url,
        source: "cloudinary",
        alt: bestMatch.description,
        title: bestMatch.name,
      };
      continue;
    }

    // Fallback: generate with DALL·E
    try {
      const prompt = {
        task: "Create a PECS-style educational image.",
        style: {
          type: "PECS",
          visual_description:
            style === "monster"
              ? `Child-friendly monster performing: ${text}`
              : `Simple PECS illustration of: ${text}`,
        },
        metadata: {
          alt: `PECS-style image showing ${text}`,
          title: text.slice(0, 60),
        },
      };

      const aiResp = await openai.images.generate({
        model: "dall-e-3",
        prompt: JSON.stringify(prompt),
        size: "512x512",
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

// Alias for compatibility with routes
export { fetchBestPecsImagesWithFallback as fetchBestPecsImagesSemantic };

// Default export of the configured Cloudinary client
export default cloudinary;
