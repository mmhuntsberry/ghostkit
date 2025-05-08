// File: apps/figma-rest-test/app/components/charts/InsertionChart.tsx

"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";

export interface WeeklyTrend {
  week: string;
  totalInsertions: number;
  detachments?: number;
}

interface InsertionChartProps {
  data?: WeeklyTrend[]; // optional array
  height?: number; // chart height in px
}

export default function InsertionChart({
  data = [],
  height = 300,
}: InsertionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    const container = containerRef.current;
    if (!svgEl || !container) return;

    // don't draw when no data
    if (data.length === 0) {
      // clear any previous drawing
      d3.select(svgEl).selectAll("*").remove();
      return;
    }

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const heightPx = height;

    // draw logic based on container width
    const draw = (containerWidth: number) => {
      const widthPx = containerWidth;
      const innerWidth = widthPx - margin.left - margin.right;
      const innerHeight = heightPx - margin.top - margin.bottom;

      const svg = d3
        .select(svgEl)
        .attr("width", widthPx)
        .attr("height", heightPx)
        .style("display", "block");

      // clear previous
      svg.selectAll("*").remove();

      // parse dates
      const parseDate = d3.timeParse("%Y-%m-%d");
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => parseDate(d.week)!) as [Date, Date])
        .range([0, innerWidth]);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.totalInsertions)!])
        .nice()
        .range([innerHeight, 0]);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // line generator
      const lineGen = d3
        .line<WeeklyTrend>()
        .x((d) => xScale(parseDate(d.week)!))
        .y((d) => yScale(d.totalInsertions));

      // draw line
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 2)
        .attr("d", lineGen as any);

      // left axis
      g.append("g").call(d3.axisLeft(yScale));

      // bottom axis with rotated ticks
      const tickCount = Math.max(2, Math.floor(innerWidth / 100));
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .ticks(tickCount)
            .tickFormat(d3.timeFormat("%b %d") as (d: Date) => string)
        )
        .selectAll("text")
        .style("font-size", "0.8em")
        .attr("dy", "0.7em")
        .attr("dx", "-0.5em")
        .attr("transform", "rotate(-30)");
    };

    // observe resize
    const ro = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      draw(width);
    });
    ro.observe(container);

    // cleanup
    return () => ro.disconnect();
  }, [data, height]);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg ref={svgRef} />
    </div>
  );
}
