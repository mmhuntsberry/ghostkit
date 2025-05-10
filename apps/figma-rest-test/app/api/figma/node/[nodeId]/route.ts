import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  const token = process.env.FIGMA_API_KEY;
  const nodeId = params.nodeId;
  const fileKey = "APVsrKR3zk0Flt5VyqSgvv"; // Hearst Design System file key

  if (!token) {
    return NextResponse.json(
      { error: "Missing FIGMA_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
      {
        headers: {
          "X-Figma-Token": token,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Figma API error: ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching node:", error);
    return NextResponse.json(
      { error: "Failed to fetch node properties" },
      { status: 500 }
    );
  }
}
