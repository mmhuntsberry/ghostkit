"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { BaseType } from "d3";

export interface RadarDatum {
  axis: string; // Metric name
  value: number; // 0–100
}

interface HealthRadarProps {
  data: RadarDatum[];
  size?: number; // chart diameter
}

export default function HealthRadar({ data, size = 300 }: HealthRadarProps) {
  const ref = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    const svg = d3.select(ref.current);
    const container = containerRef.current;

    svg.selectAll("*").remove();

    const metrics = [
      "Adoption Coverage",
      "Usage Growth",
      "Consistency",
      "Reach",
      "Time to Value",
    ];
    const allData = metrics.map(
      (axis) => data.find((d) => d.axis === axis) || { axis, value: 0 }
    );

    const margin = { top: 30, right: 60, bottom: 60, left: 60 };
    const width = size + margin.left + margin.right;
    const height = size + margin.top + margin.bottom;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const radius = size / 2;
    const angleSlice = (2 * Math.PI) / allData.length;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + radius}, ${margin.top + radius})`
      );

    // Radar grid
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append("circle")
        .attr("r", (radius * level) / levels)
        .attr("fill", "none")
        .attr("stroke", "var(--palette-neutral-800)");
    }

    // Axes + Labels
    allData.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", rScale(100) * Math.cos(angle))
        .attr("y2", rScale(100) * Math.sin(angle))
        .attr("stroke", "var(--palette-neutral-800)");

      const label = d.axis;
      g.append("text")
        .attr("x", (rScale(100) + 18) * Math.cos(angle))
        .attr("y", (rScale(100) + 18) * Math.sin(angle))
        .attr("text-anchor", "middle")
        .style("font-size", "var(--font-size-md)")
        .style("font-weight", "var(--font-weight-870)")
        .style("font-family", "var(--font-family-mac-default)")
        .style("fill", "var(--palette-neutral-lightest)")
        .text(label);
    });

    // Radar shape
    const radarLine = d3
      .lineRadial<RadarDatum>()
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed);

    g.append("path")
      .datum(allData)
      .attr("d", radarLine as any)
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2);

    // Tooltip div
    const tooltip = d3
      .select(container)
      .selectAll<HTMLDivElement, unknown>(".radar-tooltip")
      .data([null])
      .join("div")
      .attr("class", "radar-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "var(--palette-neutral-900)")
      .style("color", "var(--palette-neutral-lightest)")
      .style("padding", "4px 8px")
      .style("font-size", "0.8em")
      .style("border-radius", "4px")
      .style("opacity", 0);

    // Hoverable points
    g.selectAll("circle.radar-dot")
      .data(allData)
      .join("circle")
      .attr("class", "radar-dot")
      .attr(
        "cx",
        (d, i) => rScale(d.value) * Math.cos(i * angleSlice - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => rScale(d.value) * Math.sin(i * angleSlice - Math.PI / 2)
      )
      .attr("r", 6)
      .attr("fill", "var(--palette-neutral-lightest)")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .on("mouseenter", function (event, d, i) {
        const dot = this as SVGCircleElement;
        const point = ref.current!.createSVGPoint();
        point.x = +dot.getAttribute("cx")!;
        point.y = +dot.getAttribute("cy")!;
        const screenCTM = dot.getScreenCTM();
        if (!screenCTM) return;

        const { left, top } = container.getBoundingClientRect();
        const transformed = point.matrixTransform(screenCTM);

        tooltip
          .html(`<strong>${d.axis}</strong><br/>${d.value.toFixed(1)}%`)
          .style("left", `${transformed.x - left + 10}px`)
          .style("top", `${transformed.y - top - 30}px`)
          .transition()
          .duration(150)
          .style("opacity", 1);
      })
      .on("mouseleave", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  }, [data, size]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg ref={ref} />
    </div>
  );
}
