// File: apps/figma-rest-test/app/api/figma-analytics/component-insertions/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_API_KEY;
const LIBRARY_FILE_KEY = process.env.FIGMA_FILE_ID;
const DS_TEAM_NAME = process.env.FIGMA_DS_TEAM_NAME;

if (!FIGMA_TOKEN) throw new Error("Missing FIGMA_API_KEY");
if (!LIBRARY_FILE_KEY) throw new Error("Missing FIGMA_FILE_ID");
// DS_TEAM_NAME optional

interface TeamActionRow {
  week: string;
  insertions: number;
  detachments: number;
  team_name: string;
}
interface TeamActionsResponse {
  rows: TeamActionRow[];
  cursor?: string;
  next_page?: boolean;
}

async function figmaFetch<T>(path: string): Promise<T> {
  const res = await fetch(
    `https://api.figma.com/v1/analytics/libraries/${LIBRARY_FILE_KEY}/${path}`,
    { headers: { "X-FIGMA-TOKEN": FIGMA_TOKEN as string } }
  );
  if (!res.ok) {
    const body = await res.text();
    console.error("Figma API error payload:", body);
    throw new Error(`Figma API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

// --- Fallback path for snapshots ---
const SNAPSHOT_PATH = path.resolve(
  process.cwd(),
  "figma-snapshots",
  "component-insertions.latest.json"
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const days = Math.max(1, Number(url.searchParams.get("days") || "90"));
    const excludeSelf = url.searchParams.get("excludeSelf") !== "false";

    const endDate = formatDate(new Date());
    const startDate = formatDate(new Date(Date.now() - days * 864e5));

    const { rows } = await figmaFetch<TeamActionsResponse>(
      `component/actions?group_by=team&start_date=${startDate}&end_date=${endDate}`
    );

    const filtered =
      excludeSelf && DS_TEAM_NAME
        ? rows.filter((r) => r.team_name !== DS_TEAM_NAME)
        : rows;

    const agg: Record<string, { insertions: number; detachments: number }> = {};
    filtered.forEach((r) => {
      if (!agg[r.week]) agg[r.week] = { insertions: 0, detachments: 0 };
      agg[r.week].insertions += r.insertions;
      agg[r.week].detachments += r.detachments;
    });

    const data = Object.entries(agg)
      .map(([week, { insertions, detachments }]) => ({
        week,
        insertions,
        detachments,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    const responseData = { startDate, endDate, days, data };

    // --- Save a snapshot for fallback ---
    try {
      fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
      fs.writeFileSync(
        SNAPSHOT_PATH,
        JSON.stringify(responseData, null, 2),
        "utf-8"
      );
    } catch (snapErr) {
      console.warn("Could not write fallback snapshot:", snapErr);
    }

    const response = NextResponse.json(responseData);
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=3600"
    );
    return response;
  } catch (err: unknown) {
    // --- Fallback to last snapshot ---
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const fallback = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf-8"));
      return NextResponse.json({
        ...fallback,
        fallback: true,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // --- No snapshot available: regular error ---
    console.error(err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
