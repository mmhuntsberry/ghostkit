// app/api/story-pages/[id]/image/route.ts
import { db } from "../../../../../db";
import { storyPages } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { imageUrl } = await req.json();

  await db
    .update(storyPages)
    .set({ imageUrl })
    .where(eq(storyPages.id, Number(params.id)));

  return NextResponse.json({ success: true });
}
