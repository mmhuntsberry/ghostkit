// lib/cloudinary.ts
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { getEmbedding, cosineSimilarity } from "./embeddings";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Simple function to fetch images from Cloudinary under the 'pecs/' folder.
 */
export async function fetchImagesFromCloudinary() {
  const { resources } = await cloudinary.v2.api.resources({
    type: "upload",
    prefix: "pecs/",
    max_results: 200,
  });
  return resources.map((img) => ({
    // Clean filename to be used as descriptive text
    name: img.public_id.replace("pecs/", "").toLowerCase(),
    url: img.secure_url,
  }));
}

/**
 * Uses semantic search to match the meaning of the story text with image names.
 * This function computes the embedding of the story text and compares it to the embeddings
 * of each image's name (used as a description). Returns a mapping of page indices (as strings) to image URLs.
 */
export async function fetchBestPecsImagesSemantic(
  story: string
): Promise<{ pecs: Record<string, string> }> {
  try {
    // Get an embedding for the whole story text
    const storyEmbedding = await getEmbedding(story);

    // Get images from Cloudinary
    const images = await fetchImagesFromCloudinary();

    // Compute embeddings for each image's name (as its description)
    const imageEmbeddings = await Promise.all(
      images.map(async (img) => {
        const embedding = await getEmbedding(img.name);
        return { ...img, embedding };
      })
    );

    // Sort images by cosine similarity to the story embedding
    const sortedImages = imageEmbeddings.sort((a, b) => {
      const simA = cosineSimilarity(storyEmbedding, a.embedding);
      const simB = cosineSimilarity(storyEmbedding, b.embedding);
      return simB - simA;
    });

    // For simplicity, select the top 4 images for the 4 pages
    const topImages = sortedImages.slice(0, 4);
    const pecs: Record<string, string> = {};
    topImages.forEach((img, idx) => {
      pecs[idx.toString()] = img.url;
    });

    console.log("Semantic PECS mapping:", pecs);
    return { pecs };
  } catch (error) {
    console.error("Error fetching semantic PECS images:", error);
    return { pecs: {} };
  }
}
