// apps/neurotales/app/api/upload-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileEntry = formData.get("file");

    if (!fileEntry) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // Narrow the union so TS knows this is a Blob/File
    if (!(fileEntry instanceof Blob)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Now `fileEntry.arrayBuffer()` is valid
    const arrayBuffer = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataUri = `data:${fileEntry.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(dataUri, {
      folder: "user-images",
    });

    return NextResponse.json({ imageUrl: result.secure_url });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
