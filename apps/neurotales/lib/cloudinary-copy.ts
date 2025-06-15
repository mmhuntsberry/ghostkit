// lib/cloudinary.ts

import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { getEmbedding, cosineSimilarity } from "./embeddings";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

// Raw shape returned by Cloudinary’s API
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
}

// Shape you expose to the rest of your app
interface CloudinaryImage {
  name: string;
  url: string;
  embedding?: number[];
}

/**
 * Simple function to fetch images under 'pecs/'.
 */
export async function fetchImagesFromCloudinary(): Promise<CloudinaryImage[]> {
  const response = await cloudinary.v2.api.resources({
    type: "upload",
    prefix: "pecs/",
    max_results: 200,
  });

  const resources: CloudinaryResource[] = response.resources;

  return resources.map(
    (img: CloudinaryResource): CloudinaryImage => ({
      name: img.public_id.replace("pecs/", "").toLowerCase(),
      url: img.secure_url,
    })
  );
}

/**
 * Semantic matching of story text → images.
 */
export async function fetchBestPecsImagesSemantic(
  story: string
): Promise<{ pecs: Record<string, string> }> {
  try {
    const storyEmbedding = await getEmbedding(story);
    const images = await fetchImagesFromCloudinary();

    const imageEmbeddings: CloudinaryImage[] = await Promise.all(
      images.map(async (img: CloudinaryImage) => {
        const embedding = await getEmbedding(img.name);
        return { ...img, embedding };
      })
    );

    const sorted = imageEmbeddings.sort((a, b) => {
      const simA = cosineSimilarity(storyEmbedding, a.embedding!);
      const simB = cosineSimilarity(storyEmbedding, b.embedding!);
      return simB - simA;
    });

    const top4 = sorted.slice(0, 4);
    const pecs: Record<string, string> = {};
    top4.forEach((img: CloudinaryImage, idx: number) => {
      pecs[idx.toString()] = img.url;
    });

    return { pecs };
  } catch (err) {
    console.error("Error fetching semantic PECS images:", err);
    return { pecs: {} };
  }
}

/**
 * Example: filter images by a “monster” style flag.
 */
export async function fetchImagesByStyle(
  style: "monster" | "regular"
): Promise<CloudinaryImage[]> {
  const response = await cloudinary.v2.api.resources({
    type: "upload",
    prefix: "pecs/",
    max_results: 200,
  });

  const resources: CloudinaryResource[] = response.resources;

  return resources
    .filter((img: CloudinaryResource) => {
      const monster = isMonsterImage(img.public_id);
      return style === "monster" ? monster : !monster;
    })
    .map(
      (img: CloudinaryResource): CloudinaryImage => ({
        name: img.public_id,
        url: img.secure_url,
      })
    );
}

/** Your helper to detect monster‐style names */
function isMonsterImage(publicId: string): boolean {
  // e.g. if your monster images all contain “monster_”
  return publicId.includes("monster_");
}

export default fetchImagesFromCloudinary;
