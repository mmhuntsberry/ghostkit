"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface HealthGaugeProps {
  score: number; // 0-100
  size?: number; // diameter of gauge
}

export default function HealthGauge({ score, size = 200 }: HealthGaugeProps) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const radius = size / 2;
    const thickness = 20;

    const arcBackground = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const arcForeground = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (Math.PI * score) / 100);

    const g = svg
      .attr("width", size)
      .attr("height", radius + thickness)
      .append("g")

      .attr("transform", `translate(${radius}, ${radius})`);

    g.append("path")
      .attr("d", arcBackground()!)
      .attr("fill", "var(--palette-neutral-lightest)");

    g.append("path")
      .attr("d", arcForeground()!)
      .attr("fill", "var(--palette-neutral-lightest)");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.25em")
      .style("font-size", "var(--font-size-2xl)")
      .style("fill", "var(--palette-neutral-lightest)")
      .text(`${score.toFixed(1)}%`);
  }, [score, size]);

  return <svg ref={ref} />;
}
