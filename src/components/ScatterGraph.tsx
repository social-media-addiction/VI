import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import * as d3 from 'd3';

export interface ScatterData {
  x: number;
  y: number;
  label?: string;
}

interface ScatterGraphProps {
  data: ScatterData[];
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

const ScatterGraph: React.FC<ScatterGraphProps> = ({ data, xLabel = 'X Axis', yLabel = 'Y Axis', color = '#8b5cf6' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = dimensions.width - margin.left - margin.right;
  const chartHeight = dimensions.height - margin.top - margin.bottom;

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xMax = d3.max(data, d => d.x) || 0;
    const yMax = d3.max(data, d => d.y) || 0;

    const xScale = d3.scaleLinear()
      .domain([0, xMax * 1.1])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([chartHeight, 0]);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", 11);

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", 11);

    // Axis styling
    g.selectAll(".domain, .tick line")
      .attr("stroke", "rgba(255,255,255,0.3)");

    // X Axis Label
    g.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', chartHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('font-weight', '500')
      .text(xLabel);

    // Y Axis Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -chartHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('font-weight', '500')
      .text(yLabel);

    // Dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', color)
      .attr('opacity', 0.7)
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(_event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('opacity', 1);
        
        // Show tooltip
        const dotX = xScale(d.x);
        const dotY = yScale(d.y) - 15;
        
        g.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${dotX},${dotY})`);
        
        const tooltip = g.select('.tooltip');
        
        // Background
        tooltip.append('rect')
          .attr('x', -30)
          .attr('y', -30)
          .attr('width', 60)
          .attr('height', 35)
          .attr('rx', 5)
          .attr('fill', 'rgba(31, 41, 55, 0.95)')
          .attr('stroke', '#69b3a2')
          .attr('stroke-width', 2);
        
        // Y value
        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -5)
          .attr('fill', '#69b3a2')
          .attr('font-size', 14)
          .attr('font-weight', 'bold')
          .text(d.y.toFixed(1));
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5)
          .attr('opacity', 0.7);
        
        // Remove tooltip
        g.selectAll('.tooltip').remove();
      });

  }, [data, dimensions, xLabel, yLabel, color]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default ScatterGraph;
