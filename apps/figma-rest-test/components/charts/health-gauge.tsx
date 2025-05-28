// File: apps/figma-rest-test/app/components/charts/HealthGauge.tsx

"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HealthGaugeProps {
  score?: number; // Can be undefined
  size?: number;
}

export default function HealthGauge({
  score = 0,
  size = 200,
}: HealthGaugeProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = size / 2;
    const thickness = 20;

    const arcGenerator = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    const backgroundArc = {
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2,
    };

    const foregroundArc = {
      startAngle: -Math.PI / 2,
      endAngle: -Math.PI / 2 + (Math.PI * (score ?? 0)) / 100,
    };

    const g = svg
      .attr("width", size)
      .attr("height", radius + thickness)
      .style("display", "block")
      .append("g")
      .attr("transform", `translate(${radius}, ${radius})`);

    g.append("path")
      .attr("d", arcGenerator(backgroundArc as any)!)
      .attr("fill", "var(--palette-neutral-800)");

    g.append("path")
      .attr("d", arcGenerator(foregroundArc as any)!)
      .attr("fill", "var(--palette-neutral-200)");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.25em")
      .style("font-size", "var(--font-size-2xl)")
      .style("fill", "var(--palette-neutral-lightest)")
      .text(
        typeof score === "number" && !isNaN(score)
          ? `${score.toFixed(1)}%`
          : "—"
      );
  }, [score, size]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={ref} />
    </div>
  );
}
