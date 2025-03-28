import { db } from "../../../db";
import { subscribers } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  await db
    .update(subscribers)
    .set({ unsubscribed: true })
    .where(eq(subscribers.email, email));

  return NextResponse.json({ success: true });
}
