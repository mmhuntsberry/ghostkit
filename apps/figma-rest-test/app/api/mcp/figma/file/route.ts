// GET /api/mcp/figma/file → 400 with usage hint for Cursor

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Missing fileId. Try: /api/mcp/figma/file/:fileId",
    },
    { status: 400 }
  );
}
