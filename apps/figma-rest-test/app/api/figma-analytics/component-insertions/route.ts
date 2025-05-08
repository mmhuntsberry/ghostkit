// File: apps/figma-rest-test/app/api/figma-analytics/component-insertions/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dotenv from "dotenv";
dotenv.config();

// Env variables
const FIGMA_TOKEN = process.env.FIGMA_API_KEY!;
const LIBRARY_FILE_KEY = process.env.FIGMA_FILE_ID!;
const DS_TEAM_NAME = process.env.FIGMA_DS_TEAM_NAME!; // e.g. "Hearst Design System"

// Types for team-level actions
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

// Helper to call Figma Analytics
async function figmaFetch<T>(path: string): Promise<T> {
  const res = await fetch(
    `https://api.figma.com/v1/analytics/libraries/${LIBRARY_FILE_KEY}/${path}`,
    { headers: { "X-FIGMA-TOKEN": FIGMA_TOKEN } }
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Figma API error ${res.status}: ${txt}`);
  }
  return res.json() as Promise<T>;
}

export async function GET(_req: NextRequest) {
  // Define 90-day window
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  // 1️⃣ Fetch component actions grouped by TEAM
  const { rows } = await figmaFetch<TeamActionsResponse>(
    `component/actions?group_by=team&start_date=${startDate}&end_date=${endDate}`
  );

  // 2️⃣ Exclude your own Design System team
  const external = rows.filter((r) => r.team_name !== DS_TEAM_NAME);

  // 3️⃣ Aggregate insertions & detachments per week
  const agg: Record<string, { insertions: number; detachments: number }> = {};
  external.forEach((r) => {
    const wk = r.week;
    if (!agg[wk]) agg[wk] = { insertions: 0, detachments: 0 };
    agg[wk].insertions += r.insertions;
    agg[wk].detachments += r.detachments;
  });

  // 4️⃣ Build sorted array of weekly data
  const data = Object.entries(agg)
    .map(([week, { insertions, detachments }]) => ({
      week,
      insertions,
      detachments,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));

  // Return JSON
  return NextResponse.json({ startDate, endDate, data });
}
