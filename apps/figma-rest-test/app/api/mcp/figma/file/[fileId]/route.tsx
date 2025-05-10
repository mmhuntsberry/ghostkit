// File: apps/figma-rest-test/app/api/mcp/figma/file/[fileId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

const FIGMA_API_TOKEN =
  process.env.FIGMA_API_TOKEN || process.env.FIGMA_API_KEY;

if (!FIGMA_API_TOKEN) {
  throw new Error("Missing FIGMA_API_TOKEN or FIGMA_API_KEY");
}

export async function GET(
  req: NextRequest,
  context: { params: { fileId: string } }
) {
  const { fileId } = context.params;

  console.log("🧠 fileId received in route:", fileId);

  const proxyUrl = `http://localhost:4000/mcp/figma/file/${fileId}`;

  const response = await fetch(proxyUrl, {
    method: "GET",
    headers: {
      "X-Figma-Token": FIGMA_API_TOKEN as string,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ MCP proxy failed:", errorText);
    return NextResponse.json(
      { error: "MCP fetch failed", details: errorText },
      { status: 500 }
    );
  }

  const json = await response.json();
  return NextResponse.json(json);
}
