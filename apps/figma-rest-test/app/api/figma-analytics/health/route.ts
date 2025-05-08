// apps/figma-rest-test/app/api/figma-analytics/health/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dotenv from "dotenv";

dotenv.config();

// Env vars
const FIGMA_TOKEN = process.env.FIGMA_API_KEY;
const LIBRARY_FILE_KEY = process.env.FIGMA_FILE_ID;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!FIGMA_TOKEN) throw new Error("Missing FIGMA_API_KEY");
if (!LIBRARY_FILE_KEY) throw new Error("Missing FIGMA_FILE_ID");
if (!OPENAI_KEY) throw new Error("Missing OPENAI_API_KEY");

// Helper: fetch from Figma Analytics
async function fetchFigma<T>(path: string): Promise<T> {
  const res = await fetch(
    `https://api.figma.com/v1/analytics/libraries/${LIBRARY_FILE_KEY}/${path}`,
    { headers: { "X-FIGMA-TOKEN": FIGMA_TOKEN } }
  );
  if (!res.ok) throw new Error(`Figma API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// 1. Get component actions (insertions & detachments)
interface ActionRow {
  week: string;
  insertions: number;
  detachments: number;
}
async function getActions(): Promise<ActionRow[]> {
  const resp = await fetchFigma<{
    rows: { week: string; insertions: number; detachments: number }[];
  }>(
    `component/actions?group_by=component&start_date=${getStartDate()}&end_date=${getEndDate()}`
  );
  return resp.rows;
}

// 2. Get component usages (unique components used)
async function getUsages(): Promise<number> {
  const resp = await fetchFigma<{
    rows: { component_key: string; usages: number }[];
  }>(`component/usages?group_by=component`);
  // count of components with usages > 0
  return resp.rows.filter((r) => r.usages > 0).length;
}

// Date utilities (90-day window)
const DAYS = 90;
function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function getEndDate() {
  return formatDate(new Date());
}
function getStartDate() {
  return formatDate(new Date(Date.now() - DAYS * 864e5));
}

// Compute metrics
async function computeMetrics() {
  const actions = await getActions();
  const totalComponentsUsed = await getUsages();
  // 1) Adoption Coverage = used components / total components
  const totalComponents = actions.length; // approx total distinct components
  const adoptionCoverage = (totalComponentsUsed / totalComponents) * 100;

  // 2) Usage Momentum: split actions into two halves
  const half = Math.floor(actions.length / 2);
  const first = actions.slice(0, half).reduce((s, r) => s + r.insertions, 0);
  const second = actions.slice(half).reduce((s, r) => s + r.insertions, 0);
  const usageMomentum = first > 0 ? ((second - first) / first) * 100 : 0;

  // 3) Consistency = 1 - (total detachments / total insertions)
  const totalInsertions = actions.reduce((s, r) => s + r.insertions, 0);
  const totalDetachments = actions.reduce((s, r) => s + r.detachments, 0);
  const consistency =
    totalInsertions > 0 ? (1 - totalDetachments / totalInsertions) * 100 : 100;

  // Composite health score (equal weight)
  const healthScore =
    [adoptionCoverage, usageMomentum, consistency].reduce(
      (sum, v) => sum + v,
      0
    ) / 3;

  return { adoptionCoverage, usageMomentum, consistency, healthScore };
}

// Call OpenAI for narrative
async function getAISummary(metrics: Record<string, number>) {
  const prompt = `Design System Health:
Adoption Coverage: ${metrics.adoptionCoverage.toFixed(1)}%
Usage Momentum: ${metrics.usageMomentum.toFixed(1)}%
Consistency: ${metrics.consistency.toFixed(1)}%
Overall Health: ${metrics.healthScore.toFixed(1)}%

Summarize these results in two sentences and recommend the top two actions to improve the health score.`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a design systems strategist." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    }),
  });
  const { choices } = await resp.json();
  return choices?.[0]?.message?.content.trim() ?? "";
}

// API Route
export async function GET(req: NextRequest) {
  try {
    const metrics = await computeMetrics();
    const aiSummary = await getAISummary(metrics);
    return NextResponse.json({ metrics, aiSummary });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
