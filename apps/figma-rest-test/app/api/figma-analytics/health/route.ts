// File: apps/figma-rest-test/app/api/figma-analytics/health/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dotenv from "dotenv";
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_API_KEY;
const LIBRARY_FILE_KEY = process.env.FIGMA_FILE_ID;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!FIGMA_TOKEN) throw new Error("Missing FIGMA_API_KEY");
if (!LIBRARY_FILE_KEY) throw new Error("Missing FIGMA_FILE_ID");
if (!OPENAI_KEY) throw new Error("Missing OPENAI_API_KEY");

async function fetchFigma<T>(path: string): Promise<T> {
  const res = await fetch(
    `https://api.figma.com/v1/analytics/libraries/${LIBRARY_FILE_KEY}/${path}`,
    { headers: { "X-FIGMA-TOKEN": FIGMA_TOKEN || "" } }
  );
  if (!res.ok) throw new Error(`Figma API error: ${res.status}`);
  return res.json() as Promise<T>;
}

interface ActionRow {
  week: string;
  insertions: number;
  detachments: number;
}
interface UsageRow {
  component_key: string;
  usages: number;
  teams_using: number;
  files_using: number;
  created: string;
}
interface PublishedComponentRow {
  key: string;
  created_at: string;
}

const DAYS = 90;
const SYSTEM_START_DATE = new Date("2025-03-25");
function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function getEndDate() {
  return formatDate(new Date());
}
function getStartDate() {
  return formatDate(new Date(Date.now() - DAYS * 864e5));
}

async function computeMetrics() {
  const usagesResp = await fetchFigma<{ rows: UsageRow[] }>(
    `component/usages?group_by=component`
  );
  const usageRows = usagesResp.rows;
  const usedComponents = usageRows.filter((r) => r.usages > 0).length;
  const totalComponents = usageRows.length;
  const adoptionCoverage = (usedComponents / totalComponents) * 100;

  const actionsResp = await fetchFigma<{ rows: ActionRow[] }>(
    `component/actions?group_by=component&start_date=${getStartDate()}&end_date=${getEndDate()}`
  );
  const actions = actionsResp.rows;
  const half = Math.floor(actions.length / 2);
  const first = actions.slice(0, half).reduce((s, r) => s + r.insertions, 0);
  const second = actions.slice(half).reduce((s, r) => s + r.insertions, 0);
  const usageGrowth = first > 0 ? ((second - first) / first) * 100 : 0;

  const totalInsertions = actions.reduce((s, r) => s + r.insertions, 0);
  const totalDetachments = actions.reduce((s, r) => s + r.detachments, 0);
  const consistency =
    totalInsertions > 0 ? (1 - totalDetachments / totalInsertions) * 100 : 100;

  const reachTeams = new Set(usageRows.map((r) => r.teams_using)).size;
  const reach = reachTeams;

  let timeToValue = 0;
  try {
    const publishedResp = await fetchFigma<{ rows: PublishedComponentRow[] }>(
      `component/published?group_by=component`
    );
    const published = publishedResp.rows;
    let totalDays = 0;
    let counted = 0;
    for (const row of usageRows) {
      const pub = published.find((p) => p.key === row.component_key);
      if (!pub || !row.usages) continue;
      const publishedDate = new Date(pub.created_at);
      const firstUsedDate = new Date(row.created);
      const days = Math.max(
        0,
        (firstUsedDate.getTime() - publishedDate.getTime()) / 864e5
      );
      totalDays += days;
      counted++;
    }
    timeToValue = counted ? totalDays / counted : 0;
  } catch {
    timeToValue = 0;
  }

  const normTimeToValue = Math.max(
    0,
    100 - Math.min(timeToValue, 60) * (100 / 60)
  );

  const healthScore =
    [
      adoptionCoverage,
      usageGrowth,
      consistency,
      Math.min(reach * 10, 100),
      normTimeToValue,
    ].reduce((sum, val) => sum + val, 0) / 5;

  return {
    adoptionCoverage,
    usageGrowth,
    consistency,
    reach: Math.min(reach * 10, 100),
    timeToValue: normTimeToValue,
    healthScore,
    raw: {
      adoptionCoverage,
      usageGrowth,
      consistency,
      reach,
      timeToValue,
      normTimeToValue,
    },
  };
}

async function getAISummary(metrics: Record<string, number>) {
  const now = new Date();
  const weeksSinceStart = Math.floor(
    (now.getTime() - SYSTEM_START_DATE.getTime()) / (7 * 864e5)
  );

  const summary = [
    `**Design System Health Check Summary (Week ${weeksSinceStart})**`,
    "",
    "✅ **Strengths:**",
  ];

  if (metrics.adoptionCoverage >= 80) {
    summary.push(
      `1. **Adoption Coverage (${metrics.adoptionCoverage.toFixed(1)}%)**`,
      `💬 "Everyone is using it."\n\nAll relevant teams have adopted the design system at least once. Great sign of engagement.\n`
    );
  }

  if (metrics.consistency >= 80) {
    summary.push(
      `2. **Consistency (${metrics.consistency.toFixed(1)}%)**`,
      `💬 "They’re using it the right way."\n\nDesigns are staying attached to the system, which means people are using components as intended.\n`
    );
  }

  summary.push("", "⚠️ **Areas for Improvement:**");

  if (metrics.usageGrowth < 0) {
    summary.push(
      `1. **Usage Growth (${metrics.usageGrowth.toFixed(1)}%)**`,
      `💬 "Usage is dropping."\n\nWhile the system is adopted, usage has declined recently. This might signal disengagement or lack of awareness of newer components.\n`
    );
  }

  if (metrics.timeToValue < 60) {
    summary.push(
      `2. **Time to Value (${metrics.timeToValue.toFixed(1)}%)**`,
      `💬 "It’s taking a while to get started."\n\nNew components are slow to reach teams. Consider onboarding or communication improvements.\n`
    );
  }

  return summary.join("\n");
}

export async function GET(req: NextRequest) {
  try {
    const metrics = await computeMetrics();

    const summaryMetrics = {
      adoptionCoverage: metrics.adoptionCoverage,
      usageGrowth: metrics.usageGrowth,
      consistency: metrics.consistency,
      reach: metrics.reach,
      timeToValue: metrics.timeToValue,
    };

    const aiSummary = await getAISummary(summaryMetrics);

    return NextResponse.json({ metrics, aiSummary });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
