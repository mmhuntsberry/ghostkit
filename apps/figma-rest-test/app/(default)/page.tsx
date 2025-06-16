// File: apps/figma-rest-test/app/dashboard/page.tsx

"use client";

import { useState, useEffect, FC } from "react";
import InsertionChart, { WeeklyTrend } from "../../components/charts/insertion";
import UsageBarChart from "../../components/charts/component-usage";
import type { UsageRow } from "../api/figma-analytics/component-usages/route";
import HealthRadar, { RadarDatum } from "../../components/charts/health-radar";
import HealthGauge from "../../components/charts/health-gauge";
import ReactMarkdown from "react-markdown";

interface SummaryCardProps {
  text: string;
}

const SummaryCard: FC<SummaryCardProps> = ({ text }) => (
  <div
    style={{
      padding: "var(--space-2xs)",
      backgroundColor: "var(--palette-neutral-1000)",
    }}
    className="col-span-full rounded-lg shadow"
  >
    <ReactMarkdown
      // className="prose dark:prose-invert max-w-none"
      components={{
        strong: ({ children }) => (
          <strong className="text-white font-semibold">{children}</strong>
        ),
        p: ({ children }) => <p className="mb-3">{children}</p>,
      }}
    >
      {text}
    </ReactMarkdown>
  </div>
);

export default function DashboardPage() {
  const [trend, setTrend] = useState<WeeklyTrend[]>([]);
  const [usages, setUsages] = useState<UsageRow[]>([]);
  const [metrics, setMetrics] = useState<{
    adoptionCoverage: number;
    usageGrowth: number;
    reach: number;
    timeToValue: number;
    consistency: number;
    healthScore: number;
  } | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resTrend, resUsage, resHealth] = await Promise.all([
          fetch("/api/figma-analytics/component-insertions"),
          fetch("/api/figma-analytics/component-usages"),
          fetch("/api/figma-analytics/health"),
        ]);

        if (!resTrend.ok)
          throw new Error(`Insertions API error: ${resTrend.status}`);
        if (!resUsage.ok)
          throw new Error(`Usages API error: ${resUsage.status}`);
        if (!resHealth.ok)
          throw new Error(`Health API error: ${resHealth.status}`);

        const jsonTrend = await resTrend.json();
        const jsonUsage = await resUsage.json();
        const jsonHealth = await resHealth.json();

        setTrend(
          jsonTrend.data.map((d: any) => ({
            week: d.week,
            totalInsertions: d.insertions,
            detachments: d.detachments,
          }))
        );
        setUsages(jsonUsage.top as UsageRow[]);
        setMetrics(jsonHealth.metrics);
        setAiSummary(jsonHealth.aiSummary);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!metrics) return <p>No metrics found.</p>;

  const healthData: RadarDatum[] = [
    { axis: "Adoption Coverage", value: metrics.adoptionCoverage },
    { axis: "Usage Growth", value: metrics.usageGrowth },
    { axis: "Consistency", value: metrics.consistency },
    { axis: "Reach", value: metrics.reach },
    { axis: "Time to Value", value: metrics.timeToValue },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold  dark:text-gray-100">
        Design System Adoption & Health Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard text={aiSummary} />

        {/* Component Insertions */}
        <div
          style={{
            backgroundColor: "var(--palette-neutral-1000)",
            // borderRadius: "var(--border-radius-sm)",
            // border: "1px solid var(--palette-neutral-500)",
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
          }}
          className="col-span-full "
        >
          <h2 className="text-lg font-medium mb-2">
            Component Insertions (90d)
          </h2>
          <InsertionChart data={trend} />
        </div>

        {/* Top Component Usages */}
        <div
          style={{
            backgroundColor: "var(--palette-neutral-1000)",
            // borderRadius: "var(--border-radius-sm)",
            // border: "1px solid var(--palette-neutral-500)",
            display: "grid",
            // gridTemplateColumns: "min-content 1fr",
            gridTemplateRows: "min-content 1fr",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <h2 className="text-lg font-medium mb-2">Top Component Usages</h2>
          <UsageBarChart data={usages} width={400} height={250} />
        </div>

        {/* Overall Health Gauge */}
        <div
          style={{
            backgroundColor: "var(--palette-neutral-1000)",
            // borderRadius: "var(--border-radius-sm)",
            // border: "1px solid var(--palette-neutral-500)",
            display: "grid",
            // gridTemplateColumns: "min-content 1fr",
            gridTemplateRows: "min-content 1fr",
            justifyItems: "center",
            alignItems: "center",
            height: "",
          }}
        >
          <h2 className="text-lg font-medium mb-2">Overall Health</h2>
          <HealthGauge score={metrics.healthScore} size={200} />
        </div>

        {/* Health Breakdown Radar */}
        <div
          style={{
            backgroundColor: "var(--palette-neutral-1000)",
            // borderRadius: "var(--border-radius-sm)",
            // border: "1px solid var(--palette-neutral-500)",
            display: "grid",
            flexDirection: "column",
            justifyItems: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
          className=""
        >
          <h2 className="text-lg font-medium mb-2">Health Breakdown</h2>
          <HealthRadar data={healthData} size={200} />
        </div>
      </div>
    </div>
  );
}
