// app/api/user-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET(req: NextRequest) {
  try {
    // Retrieve the current user's ID (based on your auth)
    const session = {}; // Replace with your session retrieval logic
    const userId = session?.user?.id || "anonymous";

    const { resources } = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: `users/${userId}/uploads`,
      max_results: 100,
    });

    const images = resources.map((img) => ({
      name: img.public_id.replace(`users/${userId}/uploads/`, "").toLowerCase(),
      url: img.secure_url,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching user images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
