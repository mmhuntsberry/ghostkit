import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    tools: [
      {
        name: "figma.file",
        method: "GET",
        url: "/api/mcp/figma/file/:fileId",
        description: "Fetch a Figma file by ID for design system inspection.",
      },
    ],
  });
}
