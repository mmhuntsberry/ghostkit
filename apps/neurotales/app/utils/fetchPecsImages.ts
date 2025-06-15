// apps/neurotales/app/utils/fetchPecsImages.ts

import cloudinary from "cloudinary";
import { extractKeyConcepts } from "../../lib/extractConcepts";
import dotenv from "dotenv";

dotenv.config();

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
}

export async function fetchBestPecsImages(
  story: string
): Promise<{ pecs: Record<string, string> }> {
  try {
    const keyConcepts = extractKeyConcepts(story);

    const response = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "pecs/",
      max_results: 100,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Narrow the type of each resource:
    const allImages: Array<{ name: string; url: string }> =
      response.resources.map((image: CloudinaryResource) => ({
        name: image.public_id.replace("pecs/", "").replace(/%20/g, " "),
        url: image.secure_url,
      }));

    // Build a map from concept → matching image URL
    const pecsMap: Record<string, string> = keyConcepts.reduce(
      (acc, concept) => {
        const matched = allImages.find((pec) =>
          pec.name.toLowerCase().includes(concept)
        );
        if (matched) {
          acc[concept] = matched.url;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    return { pecs: pecsMap };
  } catch (error: any) {
    console.error("Error fetching PECS images:", error);
    return { pecs: {} };
  }
}

export default fetchBestPecsImages;
