import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ShieldCheck, ShieldAlert, PieChart, BarChart3, Info, Sparkles, TrendingUp } from 'lucide-react';
import { BudgetCategory } from '../types';

interface BudgetD3ChartProps {
  categories: BudgetCategory[];
  totalBudget: number;
  contingencyBufferAmount: number;
  contingencyBufferPercent: number;
  onSelectCategory?: (category: string | null) => void;
  selectedCategoryName?: string | null;
}

interface ChartDatum {
  category: string;
  amount: number;
  percentage: number;
  isContingency: boolean;
  color: string;
}

// Sophisticated luxury color palette for EventGenie
const PALETTE = [
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#6366F1', // Indigo
  '#0EA5E9', // Sky
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#EC4899', // Pink
  '#EAB308', // Yellow
];
const CONTINGENCY_COLOR = '#FBBF24'; // Luminous Golden Amber for Contingency

export const BudgetD3Chart: React.FC<BudgetD3ChartProps> = ({
  categories,
  totalBudget,
  contingencyBufferAmount,
  contingencyBufferPercent,
  onSelectCategory,
  selectedCategoryName
}) => {
  const [viewMode, setViewMode] = useState<'donut' | 'waterfall'>('donut');
  const [hoveredDatum, setHoveredDatum] = useState<ChartDatum | null>(null);
  
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Prepare full data list, ensuring contingency is treated distinctly
  const chartData: ChartDatum[] = React.useMemo(() => {
    // Check if categories already has a contingency line
    const hasContingencyInCategories = categories.some(c => 
      c.category.toLowerCase().includes('contingency') || c.category.toLowerCase().includes('reserve')
    );

    let colorIdx = 0;
    const items: ChartDatum[] = categories.map((cat) => {
      const isCont = cat.category.toLowerCase().includes('contingency') || cat.category.toLowerCase().includes('reserve');
      return {
        category: cat.category,
        amount: cat.amount,
        percentage: cat.percentage,
        isContingency: isCont,
        color: isCont ? CONTINGENCY_COLOR : PALETTE[colorIdx++ % PALETTE.length]
      };
    });

    // If contingency buffer is tracked separately and not in categories, add it as a key slice
    if (!hasContingencyInCategories && contingencyBufferAmount > 0) {
      items.push({
        category: 'Contingency & Reserve Buffer',
        amount: contingencyBufferAmount,
        percentage: contingencyBufferPercent,
        isContingency: true,
        color: CONTINGENCY_COLOR
      });
    }

    return items;
  }, [categories, contingencyBufferAmount, contingencyBufferPercent]);

  // Total committed non-contingency spend
  const committedSpend = chartData
    .filter(d => !d.isContingency)
    .reduce((sum, d) => sum + d.amount, 0);

  const contingencyAmount = chartData
    .filter(d => d.isContingency)
    .reduce((sum, d) => sum + d.amount, 0) || contingencyBufferAmount;

  const contingencyPct = totalBudget > 0 
    ? Math.round((contingencyAmount / totalBudget) * 100)
    : contingencyBufferPercent;

  // D3 Render effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 500;
    const height = viewMode === 'donut' ? 360 : 320;
    const width = Math.min(containerWidth, 680);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('width', '100%')
       .attr('height', height);

    // Defs for gradients and glow filters
    const defs = svg.append('defs');

    // Glow filter for highlighted/contingency slices
    const filter = defs.append('filter')
      .attr('id', 'glow-effect')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Diagonal hatch pattern for Contingency slice to make it unmistakable
    const pattern = defs.append('pattern')
      .attr('id', 'contingency-hatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8);
    pattern.append('rect')
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', '#D97706'); // darker amber base
    pattern.append('path')
      .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
      .attr('stroke', '#FDE68A') // light amber hatch line
      .attr('stroke-width', 1.5);

    // ==========================================
    // VIEW MODE 1: DONUT WITH CONTINGENCY SHIELD
    // ==========================================
    if (viewMode === 'donut') {
      const radius = Math.min(width, height) / 2 - 24;
      const innerRadius = radius * 0.62;

      const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const pie = d3.pie<ChartDatum>()
        .value(d => d.amount)
        .sort((a, b) => (a.isContingency ? 1 : b.isContingency ? -1 : b.amount - a.amount))
        .padAngle(0.025);

      const arc = d3.arc<d3.PieArcDatum<ChartDatum>>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(6);

      // Hover / exploded arc for highlighted elements
      const arcHover = d3.arc<d3.PieArcDatum<ChartDatum>>()
        .innerRadius(innerRadius - 4)
        .outerRadius(radius + 8)
        .cornerRadius(8);

      const arcs = g.selectAll('.arc')
        .data(pie(chartData))
        .enter()
        .append('g')
        .attr('class', 'arc');

      // Draw path slices
      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.isContingency ? 'url(#contingency-hatch)' : d.data.color)
        .attr('stroke', d => d.data.isContingency ? '#F59E0B' : '#0F172A')
        .attr('stroke-width', d => d.data.isContingency ? 2.5 : 1.5)
        .style('cursor', 'pointer')
        .style('transition', 'transform 0.2s ease, opacity 0.2s ease')
        .attr('opacity', d => {
          if (hoveredDatum) {
            return hoveredDatum.category === d.data.category ? 1 : 0.45;
          }
          if (selectedCategoryName) {
            return selectedCategoryName === d.data.category ? 1 : 0.65;
          }
          return 1;
        })
        .on('mouseenter', function (event, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('d', arcHover as any)
            .attr('filter', 'url(#glow-effect)');

          setHoveredDatum(d.data);

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = '1';
            tooltipRef.current.style.left = `${event.pageX + 12}px`;
            tooltipRef.current.style.top = `${event.pageY - 28}px`;
          }
        })
        .on('mousemove', function (event) {
          if (tooltipRef.current) {
            tooltipRef.current.style.left = `${event.pageX + 12}px`;
            tooltipRef.current.style.top = `${event.pageY - 28}px`;
          }
        })
        .on('mouseleave', function (event, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('d', arc as any)
            .attr('filter', null);

          setHoveredDatum(null);
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = '0';
          }
        })
        .on('click', function (event, d) {
          if (onSelectCategory) {
            onSelectCategory(selectedCategoryName === d.data.category ? null : d.data.category);
          }
        });

      // Subtle pulse / badge on contingency slice
      arcs.filter(d => d.data.isContingency)
        .append('circle')
        .attr('transform', d => {
          const centroid = arc.centroid(d);
          return `translate(${centroid[0]}, ${centroid[1]})`;
        })
        .attr('r', 4)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#78350F')
        .attr('stroke-width', 1.5)
        .style('pointer-events', 'none');

    } 
    // ==========================================
    // VIEW MODE 2: WATERFALL / STACKED COMPARISON
    // ==========================================
    else {
      const margin = { top: 30, right: 24, bottom: 50, left: 24 };
      const innerWidth = width - margin.left - margin.right;
      
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Title header within SVG
      g.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', '#94A3B8')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.05em')
        .text('BUDGET COMPOSITION: COMMITTED SPEND vs. CONTINGENCY BUFFER');

      // Top stacked horizontal bar
      const barHeight = 44;
      const barY = 24;

      const scaleX = d3.scaleLinear()
        .domain([0, totalBudget])
        .range([0, innerWidth]);

      let cumulativeX = 0;

      chartData.forEach((d) => {
        const segWidth = scaleX(d.amount);
        const xPos = cumulativeX;
        cumulativeX += segWidth;

        const isHovered = hoveredDatum?.category === d.category;
        const isSelected = selectedCategoryName === d.category;

        const rect = g.append('rect')
          .attr('x', xPos)
          .attr('y', barY)
          .attr('width', Math.max(2, segWidth - 1))
          .attr('height', barHeight)
          .attr('rx', 3)
          .attr('fill', d.isContingency ? 'url(#contingency-hatch)' : d.color)
          .attr('stroke', d.isContingency ? '#F59E0B' : '#0F172A')
          .attr('stroke-width', d.isContingency ? 2 : 1)
          .attr('opacity', isHovered ? 1 : isSelected ? 1 : hoveredDatum ? 0.4 : 0.95)
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            setHoveredDatum(d);
            if (tooltipRef.current) {
              tooltipRef.current.style.opacity = '1';
              tooltipRef.current.style.left = `${event.pageX + 12}px`;
              tooltipRef.current.style.top = `${event.pageY - 28}px`;
            }
          })
          .on('mousemove', (event) => {
            if (tooltipRef.current) {
              tooltipRef.current.style.left = `${event.pageX + 12}px`;
              tooltipRef.current.style.top = `${event.pageY - 28}px`;
            }
          })
          .on('mouseleave', () => {
            setHoveredDatum(null);
            if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
          })
          .on('click', () => {
            if (onSelectCategory) {
              onSelectCategory(selectedCategoryName === d.category ? null : d.category);
            }
          });

        // Label if segment is wide enough
        if (segWidth > 55) {
          g.append('text')
            .attr('x', xPos + segWidth / 2)
            .attr('y', barY + barHeight / 2 + 4)
            .attr('text-anchor', 'middle')
            .attr('fill', d.isContingency ? '#FFFFFF' : '#0F172A')
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .style('pointer-events', 'none')
            .text(`${d.percentage}%`);
        }
      });

      // Axis Line & Labels Below Bar
      const axisY = barY + barHeight + 16;
      g.append('line')
        .attr('x1', 0)
        .attr('y1', axisY)
        .attr('x2', innerWidth)
        .attr('y2', axisY)
        .attr('stroke', '#334155')
        .attr('stroke-dasharray', '2,2');

      g.append('text')
        .attr('x', 0)
        .attr('y', axisY + 16)
        .attr('fill', '#64748B')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text('$0');

      g.append('text')
        .attr('x', scaleX(committedSpend))
        .attr('y', axisY + 16)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94A3B8')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`Committed: $${committedSpend.toLocaleString()}`);

      g.append('text')
        .attr('x', innerWidth)
        .attr('y', axisY + 16)
        .attr('text-anchor', 'end')
        .attr('fill', '#F59E0B')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', '700')
        .text(`Total: $${totalBudget.toLocaleString()}`);

      // Comparative Dual Card Meters inside the SVG
      const cardY = axisY + 36;
      const cardWidth = (innerWidth - 16) / 2;

      // Card 1: Committed Spend
      const c1 = g.append('g').attr('transform', `translate(0, ${cardY})`);
      c1.append('rect')
        .attr('width', cardWidth)
        .attr('height', 84)
        .attr('rx', 10)
        .attr('fill', '#090D16')
        .attr('stroke', '#1E293B');
      
      c1.append('text')
        .attr('x', 14)
        .attr('y', 24)
        .attr('fill', '#94A3B8')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text('COMMITTED EXPENSES');

      c1.append('text')
        .attr('x', 14)
        .attr('y', 48)
        .attr('fill', '#F8FAFC')
        .attr('font-size', '18px')
        .attr('font-weight', '800')
        .attr('font-family', 'monospace')
        .text(`$${committedSpend.toLocaleString()}`);

      c1.append('text')
        .attr('x', 14)
        .attr('y', 68)
        .attr('fill', '#64748B')
        .attr('font-size', '11px')
        .text(`${Math.round((committedSpend / totalBudget) * 100)}% of total allocated`);

      // Card 2: Remaining Contingency Buffer
      const c2 = g.append('g').attr('transform', `translate(${cardWidth + 16}, ${cardY})`);
      c2.append('rect')
        .attr('width', cardWidth)
        .attr('height', 84)
        .attr('rx', 10)
        .attr('fill', '#1E1708')
        .attr('stroke', '#B45309')
        .attr('stroke-width', 1.5);

      c2.append('text')
        .attr('x', 14)
        .attr('y', 24)
        .attr('fill', '#FBBF24')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text('🛡️ REMAINING CONTINGENCY RESERVE');

      c2.append('text')
        .attr('x', 14)
        .attr('y', 48)
        .attr('fill', '#F59E0B')
        .attr('font-size', '18px')
        .attr('font-weight', '800')
        .attr('font-family', 'monospace')
        .text(`$${contingencyAmount.toLocaleString()}`);

      c2.append('text')
        .attr('x', 14)
        .attr('y', 68)
        .attr('fill', '#FCD34D')
        .attr('font-size', '11px')
        .text(`${contingencyPct}% uncommitted safety margin`);
    }

  }, [chartData, viewMode, totalBudget, hoveredDatum, selectedCategoryName]);

  // Determine contingency safety status
  const getSafetyBadge = () => {
    if (contingencyPct >= 8) {
      return {
        label: 'Optimal Reserve (≥8%)',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        icon: ShieldCheck,
        description: 'Industry recommended buffer for weather, guest variance, and overtime fees.'
      };
    } else if (contingencyPct >= 5) {
      return {
        label: 'Moderate Reserve (5-7%)',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        icon: ShieldCheck,
        description: 'Adequate for minor fluctuations; monitor vendor overtime thresholds.'
      };
    } else {
      return {
        label: 'Tight Reserve (<5%)',
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        icon: ShieldAlert,
        description: 'Caution: high exposure to last-minute rental surcharges or weather adaptations.'
      };
    }
  };

  const safetyInfo = getSafetyBadge();
  const SafetyIcon = safetyInfo.icon;

  // Active display readout for center of donut
  const displayTitle = hoveredDatum ? hoveredDatum.category : 'Event Budget';
  const displayAmount = hoveredDatum ? hoveredDatum.amount : totalBudget;
  const displayPct = hoveredDatum ? `${hoveredDatum.percentage}% of total` : `${contingencyPct}% contingency buffer`;
  const isContingencyDisplay = hoveredDatum?.isContingency;

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden transition">
      
      {/* Top Header of D3 Visualization Component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              D3 Analytical Breakdown
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Spending Allocation vs. Contingency Safeguard
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Graphical inspection of dedicated vendor allocations relative to your uncommitted emergency buffer
          </p>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'donut'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Radial Wheel</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('waterfall')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'waterfall'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Spend Ratio Stack</span>
          </button>
        </div>
      </div>

      {/* Main Graphic Canvas and Readout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4" ref={containerRef}>
        
        {/* SVG Container: 7 cols */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <svg ref={svgRef} className="overflow-visible select-none" />

          {/* Center HTML Overlay for Donut Mode */}
          {viewMode === 'donut' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider max-w-[150px] truncate ${
                isContingencyDisplay ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {displayTitle}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                ${displayAmount.toLocaleString()}
              </span>
              <span className={`text-xs font-medium mt-0.5 ${
                isContingencyDisplay ? 'text-amber-300 font-semibold' : 'text-emerald-400'
              }`}>
                {displayPct}
              </span>
            </div>
          )}
        </div>

        {/* Legend & Contingency Health Metrics: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Safety Contingency Callout Card */}
          <div className={`p-4 rounded-xl border ${safetyInfo.bgColor} ${safetyInfo.borderColor} space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafetyIcon className={`w-4 h-4 ${safetyInfo.textColor}`} />
                <span className={`text-xs font-bold ${safetyInfo.textColor}`}>
                  {safetyInfo.label}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                ${contingencyAmount.toLocaleString()} ({contingencyPct}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {safetyInfo.description}
            </p>
            <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 font-mono">
              <span>Committed: ${(totalBudget - contingencyAmount).toLocaleString()}</span>
              <span>Total Cap: ${totalBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* Interactive Category Swatch List */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2 max-h-56 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Interactive Categories</span>
              <span>Amount (% Total)</span>
            </div>

            {chartData.map((d, i) => {
              const isSelected = selectedCategoryName === d.category;
              const isHovered = hoveredDatum?.category === d.category;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredDatum(d)}
                  onMouseLeave={() => setHoveredDatum(null)}
                  onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : d.category)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition cursor-pointer ${
                    isSelected || isHovered
                      ? 'bg-slate-800 text-white border border-amber-500/40'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {d.isContingency ? (
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0 border border-amber-200 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    )}
                    <span className={`truncate text-xs ${d.isContingency ? 'font-bold text-amber-300' : ''}`}>
                      {d.category}
                    </span>
                  </div>

                  <div className="text-right shrink-0 font-mono ml-2">
                    <span className="text-slate-200 font-semibold">${d.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({d.percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pl-1 italic">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Hover or click slices to isolate line items and inspect contingency impact.</span>
          </p>
        </div>
      </div>

      {/* Floating D3 Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 px-3 py-2 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-100 shadow-2xl backdrop-blur-md opacity-0 transition-opacity duration-150 text-xs"
        style={{ transform: 'translate(-50%, -100%)' }}
      >
        {hoveredDatum && (
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: hoveredDatum.color }}
              />
              <span className="font-bold text-white">
                {hoveredDatum.category}
              </span>
            </div>
            <div className="font-mono text-emerald-400 font-bold">
              ${hoveredDatum.amount.toLocaleString()}{' '}
              <span className="text-slate-400 text-[10px] font-normal">
                ({hoveredDatum.percentage}% of budget)
              </span>
            </div>
            {hoveredDatum.isContingency ? (
              <span className="text-[10px] text-amber-300 block font-sans">
                🛡️ Uncommitted Emergency Safeguard
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 block font-sans">
                Remaining Contingency: ${(totalBudget - committedSpend).toLocaleString()} ({contingencyPct}%)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
