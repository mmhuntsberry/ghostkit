"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { UsageRow } from "../../api/figma-analytics/component-usages/route";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
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

    const yScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.componentName))
      .range([0, innerHeight])
      .padding(0.1);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.filesUsing) ?? 0])
      .nice()
      .range([0, innerWidth]);

    // Tooltip div
    const tooltip = d3
      .select(container)
      .selectAll<HTMLDivElement, unknown>(".tooltip")
      .data([null])
      .join("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "var(--palette-neutral-900)")
      .style("color", "var(--palette-neutral-lightest)")
      .style("padding", "4px 8px")
      .style("font-size", "0.8em")
      .style("border-radius", "4px")
      .style("opacity", 0);

    // Bars
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", (d) => yScale(d.componentName)!)
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.filesUsing))
      .attr("fill", "currentColor")
      .on("mouseenter", function (event, d) {
        const rect = this as SVGRectElement;
        const matrix = rect.getScreenCTM();
        const svgRect = svgRef.current!.getBoundingClientRect();
        const p = svgRef.current!.createSVGPoint();
        p.x = +rect.getAttribute("x")! + xScale(d.filesUsing);
        p.y = +rect.getAttribute("y")! + yScale.bandwidth() / 2;
        const c = p.matrixTransform(matrix!);

        tooltip
          .html(
            `<strong>${d.componentName}</strong><br />Files using: ${d.filesUsing}<br />Teams: ${d.teamsUsing}`
          )
          .style(
            "left",
            `${c.x - container.getBoundingClientRect().left + 12}px`
          )
          .style("top", `${c.y - container.getBoundingClientRect().top - 32}px`)
          .transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mouseleave", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    g.append("g").call(d3.axisLeft(yScale));

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));
  }, [data, width, height]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg ref={svgRef} />
    </div>
  );
}
