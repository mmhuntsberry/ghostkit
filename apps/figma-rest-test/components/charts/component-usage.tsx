"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { UsageRow } from "../../app/api/figma-analytics/component-usages/route";

interface UsageBarChartProps {
  data: UsageRow[];
  width?: number;
  height?: number;
}

export default function UsageBarChart({
  data,
  width = 600,
  height = 400,
}: UsageBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", `${height}px`);

    const margin = { top: 20, right: 20, bottom: 30, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const yScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.componentName))
      .range([0, innerHeight])
      .padding(0.1);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.usages) ?? 0])
      .nice()
      .range([0, innerWidth]);

    // Bars
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", (d) => yScale(d.componentName)!)
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.usages))
      .attr("fill", "currentColor");

    // Axes
    g.append("g").call(d3.axisLeft(yScale));

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));
  }, [data, width, height]);

  return <svg ref={svgRef} />;
}
