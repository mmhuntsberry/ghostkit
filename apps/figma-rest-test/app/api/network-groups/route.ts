import { NextResponse } from "next/server";
import { db } from "../../../db"; // Adjust path if needed
import { networkGroups } from "../../../db/design-tokens-schema"; // Adjust path if needed

export async function GET() {
  try {
    const groups = await db.select().from(networkGroups);
    return NextResponse.json({ success: true, data: groups });
  } catch (error) {
    console.error("❌ Error fetching network groups:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch network groups" },
      { status: 500 }
    );
  }
}
