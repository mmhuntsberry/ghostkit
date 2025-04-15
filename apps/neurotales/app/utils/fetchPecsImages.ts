import cloudinary from "cloudinary";
import { extractKeyConcepts } from "../../lib/extractConcepts";
import dotenv from "dotenv";

dotenv.config();

export async function fetchBestPecsImages(story: string) {
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

    const allImages = response.resources.map((image) => ({
      name: image.public_id.replace("pecs/", "").replace(/%20/g, " "),
      url: image.secure_url,
    }));

    const pecsMap = keyConcepts.reduce((acc, concept) => {
      const matchedImage = allImages.find((pec) =>
        pec.name.toLowerCase().includes(concept)
      );
      if (matchedImage) acc[concept] = matchedImage.url;
      return acc;
    }, {} as Record<string, string>);

    return { pecs: pecsMap };
  } catch (error) {
    console.error("Error fetching PECS images:", error);
    return { pecs: {} };
  }
}

export default fetchBestPecsImages;
