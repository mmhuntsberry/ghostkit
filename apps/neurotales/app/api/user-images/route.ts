// apps/neurotales/app/api/user-images/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    // TODO: Replace this with your real session retrieval logic
    // For now we type it as any so TS won’t complain about session.user
    const session: any = {};

    // Safely pull out the user ID (or fall back to "anonymous")
    const userId = session.user?.id ?? "anonymous";

    // Fetch all images the user has uploaded to Cloudinary under their folder
    const { resources } = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: `user-images/${userId}`,
      max_results: 30,
    });

    // Narrow the shape of each resource so TS knows about public_id and secure_url
    interface CloudinaryResource {
      public_id: string;
      secure_url: string;
    }

    // Map them into simple name/url pairs
    const images = resources.map((res: CloudinaryResource) => ({
      name: res.public_id.split("/").pop() ?? res.public_id,
      url: res.secure_url,
    }));

    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Error fetching user images:", error);
    return NextResponse.json(
      { error: error.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
