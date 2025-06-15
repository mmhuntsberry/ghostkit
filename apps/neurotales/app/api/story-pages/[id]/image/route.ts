// apps/neurotales/app/api/story-pages/[id]/image/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";
import { storyPages } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * NOTE: The second parameter’s type must match what Next’s router provides,
 * so we drop the explicit context type and let it be inferred.
 */
export async function PUT(request: NextRequest, context: any) {
  try {
    // Grab the dynamic segment from context.params
    const pageId = context.params.id as string;
    const pageNum = Number(pageId);
    if (isNaN(pageNum)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Parse the incoming form-data
    const formData = await request.formData();
    const fileEntry = formData.get("file");
    if (!fileEntry) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!(fileEntry instanceof Blob)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Convert file to Data URI
    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    const dataUri = `data:${fileEntry.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary under 'story-pages'
    const result = await cloudinary.v2.uploader.upload(dataUri, {
      folder: "story-pages",
    });

    // Update the database record
    await db
      .update(storyPages)
      .set({
        imageUrl: result.secure_url,
        imageSource: "cloudinary",
      })
      .where(eq(storyPages.id, pageNum));

    return NextResponse.json({ imageUrl: result.secure_url });
  } catch (err: any) {
    console.error("Error updating story page image:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
