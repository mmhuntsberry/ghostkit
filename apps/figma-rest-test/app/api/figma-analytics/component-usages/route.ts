// File: apps/figma-rest-test/app/api/figma-analytics/component-usages/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_API_KEY;
const LIBRARY_FILE_KEY = process.env.FIGMA_FILE_ID;
if (!FIGMA_TOKEN) throw new Error("Define FIGMA_API_KEY");
if (!LIBRARY_FILE_KEY) throw new Error("Define FIGMA_FILE_ID");

interface FigmaUsageRow {
  component_key: string;
  component_name: string;
  usages: number;
  teams_using: number;
  files_using: number;
}
interface FigmaUsageResponse {
  rows: FigmaUsageRow[];
  cursor?: string;
  next_page?: boolean;
}

export interface UsageRow {
  componentName: string;
  teamsUsing: number;
  filesUsing: number;
}

async function figmaFetch<T>(path: string): Promise<T> {
  const res = await fetch(
    `https://api.figma.com/v1/analytics/libraries/${LIBRARY_FILE_KEY}/${path}`,
    { headers: { "X-FIGMA-TOKEN": FIGMA_TOKEN as string } }
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Figma API error ${res.status}: ${txt}`);
  }
  return res.json() as Promise<T>;
}

function isLikelyComponent(name: string): boolean {
  return (
    !name.includes("=") &&
    !name.includes(":") &&
    !/^(size|mode|aspect|background)/i.test(name)
  );
}

function normalizeComponentName(name: string): string {
  return name.split(/,|=/)[0].trim();
}

async function getComponentUsages(): Promise<UsageRow[]> {
  const response = await figmaFetch<FigmaUsageResponse>(
    `component/usages?group_by=component`
  );

  const deduped = new Map<string, { teamsUsing: number; filesUsing: number }>();

  for (const row of response.rows) {
    const rawName = row.component_name.trim();
    if (!isLikelyComponent(rawName)) continue;

    const baseName = normalizeComponentName(rawName);

    if (!deduped.has(baseName)) {
      deduped.set(baseName, {
        teamsUsing: row.teams_using,
        filesUsing: row.files_using,
      });
    } else {
      const existing = deduped.get(baseName)!;
      deduped.set(baseName, {
        teamsUsing: existing.teamsUsing + row.teams_using,
        filesUsing: existing.filesUsing + row.files_using,
      });
    }
  }

  return Array.from(deduped.entries()).map(([componentName, stats]) => ({
    componentName,
    teamsUsing: stats.teamsUsing,
    filesUsing: stats.filesUsing,
  }));
}

// --- Fallback path for snapshots ---
const SNAPSHOT_PATH = path.resolve(
  process.cwd(),
  "figma-snapshots",
  "component-usages.latest.json"
);

export async function GET(request: NextRequest) {
  try {
    const usages = await getComponentUsages();
    const top = usages
      .filter((u) => u.filesUsing > 0)
      .sort((a, b) => b.filesUsing - a.filesUsing)
      .slice(0, 10);

    console.log("Top Components by filesUsing:", top);

    // --- Save a snapshot for fallback ---
    try {
      fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
      fs.writeFileSync(
        SNAPSHOT_PATH,
        JSON.stringify({ top }, null, 2),
        "utf-8"
      );
    } catch (snapErr) {
      console.warn("Could not write fallback snapshot:", snapErr);
    }

    console.log("Snapshot saved to:", SNAPSHOT_PATH);

    return NextResponse.json({ top });
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
