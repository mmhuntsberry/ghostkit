// File: apps/figma-rest-test/app/dashboard/page.tsx

"use client";

import { useState, useEffect, FC } from "react";
import InsertionChart, { WeeklyTrend } from "../../components/charts/insertion";
import UsageBarChart from "../../components/charts/component-usage";
import type { UsageRow } from "../api/figma-analytics/component-usages/route";
import HealthRadar from "../../components/charts/health-radar";
import HealthGauge from "../../components/charts/health-gauge";

interface SummaryCardProps {
  text: string;
}

export const SummaryCard: FC<SummaryCardProps> = ({ text }) => (
  <div
    style={{
      padding: "var(--space-2xs)",
      borderRadius: "var(--border-radius-sm)",
      // boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--palette-neutral-400)",
    }}
  >
    {text}
  </div>
);

export default function DashboardPage() {
  const [trend, setTrend] = useState<WeeklyTrend[]>([]);
  const [usages, setUsages] = useState<UsageRow[]>([]);
  const [metrics, setMetrics] = useState<{
    adoptionCoverage: number;
    usageMomentum: number;
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

        setTrend(jsonTrend.trend as WeeklyTrend[]);
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

  const healthData = [
    { axis: "Adoption", value: metrics.adoptionCoverage },
    { axis: "Momentum", value: metrics.usageMomentum },
    { axis: "Consistency", value: metrics.consistency },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8">
      {/* Component Insertions */}
      <SummaryCard text={aiSummary}></SummaryCard>
      <div
        style={{
          backgroundColor: "var(--palette-neutral-1000)",
          borderRadius: "var(--border-radius-sm)",
          border: "var(--border-width-sm) solid var(--palette-neutral-600)",
          padding: "var(--space-sm)",
        }}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col"
      >
        <h2 className="text-lg font-medium mb-2">Component Insertions (90d)</h2>
        <InsertionChart data={trend} width={400} height={250} />
      </div>

      {/* Top Component Usages */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
        <h2 className="text-lg font-medium mb-2">Top Component Usages</h2>
        <UsageBarChart data={usages} width={400} height={250} />
      </div>

      {/* Overall Health Gauge */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
        <h2 className="text-lg font-medium mb-2">Overall Health</h2>
        <HealthGauge score={metrics.healthScore} size={200} />
      </div>

      {/* Health Breakdown Radar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
        <h2 className="text-lg font-medium mb-2">Health Breakdown</h2>
        <HealthRadar data={healthData} size={200} />
      </div>
    </div>
  );
}
