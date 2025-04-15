// app/api/pecs-images/route.ts
import { NextResponse } from "next/server";
import { fetchImagesFromCloudinary } from "../../../lib/cloudinary";

export async function GET() {
  try {
    const images = await fetchImagesFromCloudinary();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching PECS images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
