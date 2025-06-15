import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";
import { extractKeyConcepts } from "../../../lib/extractConcepts";

export async function POST(req: NextRequest) {
  try {
    const { story } = await req.json();
    const keyConcepts = extractKeyConcepts(story);

    const response = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "pecs/",
      max_results: 100,
    });

    const allImages = response.resources.map((image: any) => ({
      name: image.public_id.replace("pecs/", "").replace(/%20/g, " "),
      url: image.secure_url,
    }));

    const pecsMap = keyConcepts.reduce((acc, concept) => {
      const matchedImage = allImages.find((pec: any) =>
        pec.name.toLowerCase().includes(concept)
      );
      if (matchedImage) acc[concept] = matchedImage.url;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ pecs: pecsMap }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
