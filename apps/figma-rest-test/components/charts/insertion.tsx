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
  data: WeeklyTrend[];
  height?: number;
}

export default function InsertionChart({
  data,
  height = 300,
}: InsertionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

    // clear previous
    svg.selectAll("*").remove();

    // filter invalid
    const clean = data.filter((d) => {
      const date = new Date(d.week);
      return !isNaN(date.getTime()) && typeof d.totalInsertions === "number";
    });
    if (!clean.length) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const heightPx = height;

    const draw = (widthPx: number) => {
      svg.selectAll("*").remove(); // redraw fresh

      const innerW = widthPx - margin.left - margin.right;
      const innerH = heightPx - margin.top - margin.bottom;

      // responsive svg
      svg
        .attr("viewBox", `0 0 ${widthPx} ${heightPx}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", `${heightPx}px`);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // scales
      const xExtent = d3.extent(clean, (d) => new Date(d.week)) as [Date, Date];
      const xScale = d3.scaleTime().domain(xExtent).range([0, innerW]);
      const maxY = d3.max(clean, (d) => d.totalInsertions)!;
      const yScale = d3
        .scaleLinear()
        .domain([0, maxY])
        .nice()
        .range([innerH, 0]);

      // axes
      g.append("g").call((sel) => d3.axisLeft(yScale).ticks(5)(sel as any));
      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call((sel) =>
          d3
            .axisBottom(xScale)
            .ticks(Math.max(2, Math.floor(innerW / 80)))
            .tickFormat((d: Date | d3.NumberValue) =>
              d3.timeFormat("%b %d")(d as Date)
            )(sel as any)
        )
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .attr("text-anchor", "end");

      // line generator
      const lineGen = d3
        .line<WeeklyTrend>()
        .x((d) => xScale(new Date(d.week)))
        .y((d) => yScale(d.totalInsertions))
        .curve(d3.curveMonotoneX);

      // draw path
      g.append("path")
        .datum(clean)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 2)
        .attr("d", lineGen as any)
        .attr("stroke-dasharray", "4 2")
        .transition()
        .duration(800)
        .attr("stroke-dasharray", "");

      // tooltip container
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

      // draw points and interactivity
      g.selectAll("circle")
        .data(clean)
        .join("circle")
        .attr("cx", (d) => xScale(new Date(d.week)))
        .attr("cy", (d) => yScale(d.totalInsertions))
        .attr("r", 4)
        .attr("fill", "var(--palette-neutral-lightest)")
        .on("mouseenter", function (event, d) {
          // Use SVG coordinates instead of mouse event for precise tooltip placement
          const point = this as SVGCircleElement;
          const matrix = point.getScreenCTM();
          let cx = +point.getAttribute("cx")!;
          let cy = +point.getAttribute("cy")!;
          if (matrix) {
            const svgRect = svgRef.current!.getBoundingClientRect();
            // project (cx, cy) to screen coordinates
            const p = svgRef.current!.createSVGPoint();
            p.x = cx + margin.left;
            p.y = cy + margin.top;
            const c = p.matrixTransform(matrix);
            // place tooltip relative to container
            tooltip
              .html(`${d.week}<br/>Insertions: ${d.totalInsertions}`)
              .style(
                "left",
                `${c.x - container.getBoundingClientRect().left - 100}px`
              )
              .style(
                "top",
                `${c.y - container.getBoundingClientRect().top - 96}px`
              )
              .transition()
              .duration(200)
              .style("opacity", 1);
          }
        })
        .on("mouseleave", () => {
          tooltip.transition().duration(200).style("opacity", 0);
        });
    };

    const ro = new ResizeObserver((entries) =>
      draw(entries[0].contentRect.width)
    );
    ro.observe(container);
    return () => ro.disconnect();
  }, [data, height]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg ref={svgRef} />
    </div>
  );
}
