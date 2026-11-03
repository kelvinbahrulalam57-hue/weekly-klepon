import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TrendingUp, Flame, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { WinReport } from '../types/esports';

interface D3WinTrendGaugeProps {
  reports: WinReport[];
  totalWins: number;
  totalMatches: number;
  streak: number;
  teamName: string;
}

interface MatchTrendPoint {
  index: number;
  label: string;
  isWin: boolean;
  score: number; // cumulative or weighted form score (0-100)
  status: string;
  potName: string;
}

export const D3WinTrendGauge: React.FC<D3WinTrendGaugeProps> = ({
  reports,
  totalWins,
  totalMatches,
  streak,
  teamName,
}) => {
  const gaugeRef = useRef<SVGSVGElement | null>(null);
  const trendLineRef = useRef<SVGSVGElement | null>(null);

  // Derive the last 5 matches trend
  // If reports has items, sort chronologically for the last 5
  const last5Data: MatchTrendPoint[] = React.useMemo(() => {
    // Sort reports ascending by submission time
    const sortedReports = [...reports].sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    const points: MatchTrendPoint[] = [];
    const count = 5;

    if (sortedReports.length >= count) {
      const slice = sortedReports.slice(-count);
      slice.forEach((r, idx) => {
        const isWin = r.status === 'DONE';
        points.push({
          index: idx + 1,
          label: `Match #${idx + 1}`,
          isWin,
          score: isWin ? 100 : r.status === 'PENDING' ? 50 : 20,
          status: r.status === 'DONE' ? 'MENANG (DONE)' : r.status === 'PENDING' ? 'VERIFIKASI' : 'GAGAL',
          potName: r.potName || 'Fast Tournament FT',
        });
      });
    } else if (sortedReports.length > 0) {
      // Pad with past recorded wins if available
      const needed = count - sortedReports.length;
      for (let i = 0; i < needed; i++) {
        const isWin = i < totalWins;
        points.push({
          index: i + 1,
          label: `Match #${i + 1}`,
          isWin,
          score: isWin ? 100 : 25,
          status: isWin ? 'MENANG (FT)' : 'HASIL CS',
          potName: 'Match Sebelumnya',
        });
      }
      sortedReports.forEach((r, idx) => {
        const isWin = r.status === 'DONE';
        points.push({
          index: needed + idx + 1,
          label: `Match #${needed + idx + 1}`,
          isWin,
          score: isWin ? 100 : r.status === 'PENDING' ? 50 : 20,
          status: r.status === 'DONE' ? 'MENANG (DONE)' : r.status === 'PENDING' ? 'VERIFIKASI' : 'GAGAL',
          potName: r.potName || 'Fast Tournament FT',
        });
      });
    } else {
      // Fallback based on totalWins vs totalMatches for recent 5
      const winsInLast5 = Math.min(5, Math.max(0, totalWins));
      for (let i = 0; i < count; i++) {
        const isWin = i < winsInLast5;
        points.push({
          index: i + 1,
          label: `Match #${i + 1}`,
          isWin,
          score: isWin ? 100 : 20,
          status: isWin ? 'MENANG (FT)' : 'KALAH / MATCH LAIN',
          potName: 'Fast Tournament',
        });
      }
    }

    return points;
  }, [reports, totalWins, totalMatches]);

  const winsCountIn5 = last5Data.filter((d) => d.isWin).length;
  const consistencyRate = Math.round((winsCountIn5 / 5) * 100);

  // 1. Render D3 Radial Gauge
  useEffect(() => {
    if (!gaugeRef.current) return;

    const svg = d3.select(gaugeRef.current);
    svg.selectAll('*').remove(); // clear prior elements

    const width = 120;
    const height = 90;
    const radius = 45;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height - 10})`);

    // Define Gradients and Glow filters in defs
    const defs = svg.append('defs');

    // Arc gradient
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'gaugeGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4');
    gradient.append('stop').attr('offset', '50%').attr('stop-color', '#10b981');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b');

    // Background track arc
    const arcBackground = d3
      .arc()
      .innerRadius(34)
      .outerRadius(42)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .cornerRadius(4);

    g.append('path')
      .attr('d', arcBackground as any)
      .attr('fill', '#0c1a3e')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1);

    // Foreground filled arc based on consistency rate (0 to 100%)
    const targetAngle = -Math.PI / 2 + (consistencyRate / 100) * Math.PI;

    const arcForeground = d3
      .arc()
      .innerRadius(34)
      .outerRadius(42)
      .startAngle(-Math.PI / 2)
      .cornerRadius(4);

    // Animate arc using d3 transition
    const foregroundPath = g
      .append('path')
      .datum({ endAngle: -Math.PI / 2 })
      .attr('fill', 'url(#gaugeGradient)')
      .attr('filter', 'drop-shadow(0px 0px 4px rgba(16,185,129,0.5))');

    foregroundPath
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d: any) {
        const interpolate = d3.interpolate(d.endAngle, targetAngle);
        return function (t: number) {
          d.endAngle = interpolate(t);
          return (arcForeground as any)(d);
        };
      });

    // Center Text Value
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -8)
      .attr('fill', '#ffffff')
      .attr('font-size', '15px')
      .attr('font-weight', '900')
      .attr('font-family', 'monospace')
      .text(`${consistencyRate}%`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('fill', '#94a3b8')
      .attr('font-size', '7px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700')
      .attr('letter-spacing', '0.5px')
      .text('KONSISTENSI');
  }, [consistencyRate]);

  // 2. Render D3 Sparkline / Stepped Trend Line
  useEffect(() => {
    if (!trendLineRef.current) return;

    const svg = d3.select(trendLineRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 15, bottom: 20, left: 15 };
    const width = 240;
    const height = 75;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(last5Data.map((d) => String(d.index)))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // Gridlines horizontal
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(50))
      .attr('y2', yScale(50))
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '2 2');

    // Area Gradient
    const defs = svg.append('defs');
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'trendAreaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.35);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.0);

    // D3 Area
    const areaGenerator = d3
      .area<MatchTrendPoint>()
      .x((d) => xScale(String(d.index)) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.score))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(last5Data)
      .attr('d', areaGenerator)
      .attr('fill', 'url(#trendAreaGradient)');

    // D3 Line Generator
    const lineGenerator = d3
      .line<MatchTrendPoint>()
      .x((d) => xScale(String(d.index)) || 0)
      .y((d) => yScale(d.score))
      .curve(d3.curveMonotoneX);

    // Animated Path
    const path = g
      .append('path')
      .datum(last5Data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('d', lineGenerator);

    const totalLength = (path.node() as SVGPathElement)?.getTotalLength() || 200;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Node dots with D3
    last5Data.forEach((d) => {
      const cx = xScale(String(d.index)) || 0;
      const cy = yScale(d.score);

      // Outer glow circle
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 6)
        .attr('fill', d.isWin ? '#10b981' : '#f43f5e')
        .attr('opacity', 0.3);

      // Inner dot
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 3.5)
        .attr('fill', d.isWin ? '#34d399' : '#fb7185')
        .attr('stroke', '#04081c')
        .attr('stroke-width', 1.5);

      // X-Axis labels (M1, M2, M3, M4, M5)
      g.append('text')
        .attr('x', cx)
        .attr('y', innerHeight + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', d.isWin ? '#34d399' : '#94a3b8')
        .attr('font-size', '8px')
        .attr('font-weight', '700')
        .attr('font-family', 'monospace')
        .text(`M${d.index}`);
    });
  }, [last5Data]);

  // Momentum Status Label
  const momentumLabel =
    consistencyRate >= 80
      ? '🔥 PRIME FORM (SANGAT KONSISTEN)'
      : consistencyRate >= 60
      ? '⚡ STABIL (FORM POSITIF)'
      : '⚠️ MEMBUTUHKAN EVALUASI MATCH';

  return (
    <div className="bg-gradient-to-r from-[#060e28] via-[#04081c] to-[#081538] border-2 border-cyan-500/40 rounded-2xl p-3.5 sm:p-4 shadow-xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-blue-900/60 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xs shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold font-display uppercase text-white text-xs flex items-center gap-2">
              <span>Tren Menang 5 Match Terakhir</span>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40">
                D3 Visual Gauge
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Evaluasi konsistensi performa skuad dari 5 pertandingan terakhir.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            {momentumLabel}
          </span>
        </div>
      </div>

      {/* Main Dual D3 Visualization Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Left: D3 Radial Gauge Arc (Col 4) */}
        <div className="sm:col-span-4 bg-[#030616]/90 border border-blue-900/60 rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-inner">
          <svg ref={gaugeRef} className="w-28 h-20 overflow-visible" />
          <div className="text-[10px] font-mono text-slate-300 mt-1">
            <strong>{winsCountIn5} Menang</strong> dari 5 Match
          </div>
        </div>

        {/* Right: D3 Stepped Trend Trajectory Line (Col 8) */}
        <div className="sm:col-span-8 bg-[#030616]/90 border border-blue-900/60 rounded-xl p-2.5 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Trajektori Performa (M1 ➔ M5)</span>
            <span className="text-emerald-400 font-bold">{winsCountIn5}/5 Sukses</span>
          </div>

          <svg ref={trendLineRef} className="w-full h-18 overflow-visible" />

          {/* Quick Match Indicators */}
          <div className="flex items-center justify-between pt-1 border-t border-blue-950 text-[9px] font-mono">
            {last5Data.map((d) => (
              <div
                key={d.index}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                  d.isWin
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                }`}
                title={`${d.label}: ${d.status} (${d.potName})`}
              >
                <span>M{d.index}:</span>
                <strong className="font-black">{d.isWin ? 'W' : 'L'}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
