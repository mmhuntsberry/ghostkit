// app/api/pexels-images/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "PECS";
    const perPage = searchParams.get("per_page") || "20";

    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    if (!PEXELS_API_KEY) {
      throw new Error("Missing PEXELS_API_KEY environment variable");
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const data = await response.json();

    const images = data.photos.map((photo: any) => ({
      url: photo.src.medium, // adjust size if needed
      name: photo.photographer,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching Pexels images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
