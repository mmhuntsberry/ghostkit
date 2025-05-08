// apps/figma-rest-test/app/api/figma-analytics/component-usages/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dotenv from "dotenv";

dotenv.config();

// Ensure PAT and file key are set
const FIGMA_TOKEN = process.env.FIGMA_API_KEY;
const LIBRARY_FILE_KEY = process.env.FIGMA_FILE_ID;
if (!FIGMA_TOKEN) throw new Error("Define FIGMA_API_KEY");
if (!LIBRARY_FILE_KEY) throw new Error("Define FIGMA_FILE_ID");

// Figma Library Analytics response types
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

// Output shape for dashboard
export interface UsageRow {
  componentName: string;
  usages: number;
  teamsUsing: number;
  filesUsing: number;
}

// Figma API helper using X-FIGMA-TOKEN
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

// Fetch usage grouped by component
async function getComponentUsages(): Promise<UsageRow[]> {
  const response = await figmaFetch<FigmaUsageResponse>(
    `component/usages?group_by=component`
  );
  return response.rows.map((r) => ({
    componentName: r.component_name,
    usages: r.usages,
    teamsUsing: r.teams_using,
    filesUsing: r.files_using,
  }));
}

// API route handler
export async function GET(request: NextRequest) {
  try {
    const usages = await getComponentUsages();
    // return top 10 sorted by usages
    const top = usages.sort((a, b) => b.usages - a.usages).slice(0, 10);
    return NextResponse.json({ top });
  } catch (err: unknown) {
    console.error(err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
