import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function extractKeyConcepts(story: string): string[] {
  const stopWords = [
    "a",
    "an",
    "the",
    "and",
    "about",
    "how",
    "is",
    "going",
    "on",
    "his",
    "her",
    "their",
    "with",
    "to",
  ];
  return story
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => !stopWords.includes(word));
}

export async function fetchBestPecsImages(story: string) {
  try {
    const keyConcepts = extractKeyConcepts(story);
    const response = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "pecs/",
      max_results: 100,
    });

    const allImages = response.resources.map((image) => ({
      name: image.public_id
        .replace("pecs/", "")
        .replace(/%20/g, " ")
        .toLowerCase(),
      url: image.secure_url,
    }));

    const pecsMap = keyConcepts.reduce((acc, concept) => {
      const matchedImage = allImages.find((pec) => pec.name.includes(concept));
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
