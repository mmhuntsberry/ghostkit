"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface RadarDatum {
  axis: string;
  value: number; // 0–100
}
interface HealthRadarProps {
  data: RadarDatum[];
  size?: number; // chart diameter
}

export default function HealthRadar({ data, size = 300 }: HealthRadarProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 100, bottom: 100, left: 60 };
    const width = size + margin.left + margin.right;
    const height = size + margin.top + margin.bottom;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const radius = size / 2;
    const angleSlice = (2 * Math.PI) / data.length;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + radius}, ${margin.top + radius})`
      );

    // grid
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append("circle")
        .attr("r", (radius * level) / levels)
        .attr("fill", "none")
        .attr("stroke", "var(--palette-neutral-800)");
    }

    // axes and labels
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      // axis line
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", rScale(100) * Math.cos(angle))
        .attr("y2", rScale(100) * Math.sin(angle))
        .attr("stroke", "var(--palette-neutral-800)");

      // label
      g.append("text")
        .attr("x", (rScale(100) + 10) * Math.cos(angle))
        .attr("y", (rScale(100) + 10) * Math.sin(angle))
        .attr("text-anchor", "middle")
        .style("font-size", "var(--font-size-md)")
        .style("font-weight", "var(--font-weight-870)")
        .style("font-family", "var(--font-family-mac-default)")
        .style("fill", "var(--palette-neutral-lightest)")
        .text(d.axis);
    });

    // radar area
    const radarLine = d3
      .lineRadial<RadarDatum>()
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed);

    g.append("path")
      .datum(data)
      .attr("d", radarLine as any)
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2);
  }, [data, size]);

  return <svg ref={ref} />;
}
