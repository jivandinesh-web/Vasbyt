import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  Brush,
} from 'recharts';
import {
  Mountain,
  Droplets,
  Flag,
  ZoomIn,
  Sparkles,
  Layers,
  TrendingUp,
  Activity,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from 'lucide-react';
import { CourseWaypoint, DetailedElevationPoint } from '../types';

export interface ElevationDataPoint {
  km: number;
  ele: number;
  grade?: number;
  label?: string;
  waypoint?: CourseWaypoint;
  accumulatedGain: number;
  accumulatedLoss: number;
}

interface InteractiveElevationChartProps {
  data: DetailedElevationPoint[];
  waypoints?: CourseWaypoint[];
  totalDistanceKm: number;
  minElevationM: number;
  maxElevationM: number;
  totalAscentM: number;
  totalDescentM: number;
  discipline?: string;
  raceName?: string;
  onHoverPoint?: (pt: { km: number; ele: number; grade?: number; index: number } | null) => void;
  idPrefix?: string;
}

export const InteractiveElevationChart: React.FC<InteractiveElevationChartProps> = ({
  data,
  waypoints = [],
  totalDistanceKm,
  minElevationM,
  maxElevationM,
  totalAscentM,
  totalDescentM,
  discipline = 'road',
  raceName = 'Race Course',
  onHoverPoint,
  idPrefix = 'elev-chart',
}) => {
  const [showWaypoints, setShowWaypoints] = useState<boolean>(true);
  const [showBrush, setShowBrush] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeWaypoint, setActiveWaypoint] = useState<CourseWaypoint | null>(null);

  // Augment data points with cumulative gain/loss and nearest waypoint
  const chartData: ElevationDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    let accGain = 0;
    let accLoss = 0;

    return data.map((pt, idx) => {
      if (idx > 0) {
        const diff = pt.ele - data[idx - 1].ele;
        if (diff > 0) accGain += diff;
        else accLoss += Math.abs(diff);
      }

      // Check if there is a matching waypoint close to this km
      const matchingWp = waypoints.find(
        (wp) => Math.abs(wp.km - pt.km) <= (totalDistanceKm > 60 ? 2.5 : 1.0)
      );

      return {
        km: Number(pt.km.toFixed(1)),
        ele: Math.round(pt.ele),
        grade: pt.grade !== undefined ? Number(pt.grade.toFixed(1)) : undefined,
        label: pt.label,
        waypoint: matchingWp,
        accumulatedGain: Math.round(accGain),
        accumulatedLoss: Math.round(accLoss),
      };
    });
  }, [data, waypoints, totalDistanceKm]);

  // Elevation domain with 10% breathing room
  const yMin = Math.max(0, Math.floor((minElevationM * 0.9) / 25) * 25);
  const yMax = Math.ceil((maxElevationM * 1.1) / 25) * 25;

  // Significant waypoint markers mapped to chart points
  const milestoneDots = useMemo(() => {
    return waypoints.map((wp) => {
      let closest = chartData[0];
      let minDiff = Infinity;
      chartData.forEach((d) => {
        const diff = Math.abs(d.km - wp.km);
        if (diff < minDiff) {
          minDiff = diff;
          closest = d;
        }
      });
      return {
        wp,
        chartPt: closest || { km: wp.km, ele: wp.ele },
      };
    });
  }, [waypoints, chartData]);

  // Gradient & Incline breakdown statistics
  const terrainStats = useMemo(() => {
    let flatCount = 0;
    let rollingCount = 0;
    let steepCount = 0;
    let severeCount = 0;
    const total = chartData.length || 1;

    chartData.forEach((pt) => {
      const g = Math.abs(pt.grade || 0);
      if (g < 2.5) flatCount++;
      else if (g < 5.0) rollingCount++;
      else if (g < 8.0) steepCount++;
      else severeCount++;
    });

    const flatPct = Math.round((flatCount / total) * 100);
    const rollingPct = Math.round((rollingCount / total) * 100);
    const steepPct = Math.round((steepCount / total) * 100);
    const severePct = Math.max(0, 100 - flatPct - rollingPct - steepPct);

    // Vasbyt Climb Index (meters of ascent per km)
    const climbIndex = totalDistanceKm > 0 ? (totalAscentM / totalDistanceKm).toFixed(1) : '0';
    const climbNum = parseFloat(climbIndex);
    let category = 'Flat & Fast';
    let catColor = '#7c8f5c';

    if (climbNum > 28) {
      category = 'Mountainous Beast (Alpine)';
      catColor = '#b5502f';
    } else if (climbNum > 18) {
      category = 'Severe Climbs (Hilly)';
      catColor = '#e28b37';
    } else if (climbNum > 9) {
      category = 'Undulating & Rolling';
      catColor = '#d8b34a';
    }

    return {
      flatPct,
      rollingPct,
      steepPct,
      severePct,
      climbIndex,
      category,
      catColor,
    };
  }, [chartData, totalDistanceKm, totalAscentM]);

  // Primary color based on discipline
  const isCycling = discipline === 'cycling';
  const primaryColor = isCycling ? '#06b6d4' : '#e28b37';
  const gradientId = `${idPrefix}-recharts-gradient`;

  const handleSelectWaypoint = (wp: CourseWaypoint) => {
    setActiveWaypoint(wp);
    const foundIdx = chartData.findIndex((d) => Math.abs(d.km - wp.km) < 1.5);
    if (foundIdx >= 0) {
      const pt = chartData[foundIdx];
      onHoverPoint?.({ km: pt.km, ele: pt.ele, grade: pt.grade, index: foundIdx });
    }
  };

  return (
    <div
      id={`${idPrefix}-interactive-container`}
      className="w-full space-y-3 select-none text-left"
    >
      {/* Chart Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#141922] p-2.5 sm:p-3 rounded-xs border border-[#2c333f]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#d8b34a] flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#e28b37]" />
            Interactive Visualization
          </span>

          {/* Toggle Waypoint Dots */}
          <button
            type="button"
            onClick={() => setShowWaypoints(!showWaypoints)}
            className={`px-2.5 py-1 rounded-xs border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              showWaypoints
                ? 'bg-[#242c38] text-[#f5efe3] border-[#d8b34a]/60 shadow-xs'
                : 'bg-[#171c24] text-[#6d7580] border-[#2c333f] hover:text-[#9aa1ac]'
            }`}
            title="Toggle checkpoint and water table dots along elevation line"
          >
            <Droplets className="w-3 h-3 text-[#4f8fb0]" />
            <span>Waypoints ({waypoints.length})</span>
          </button>

          {/* Toggle Scrub & Zoom Brush */}
          <button
            type="button"
            onClick={() => setShowBrush(!showBrush)}
            className={`px-2.5 py-1 rounded-xs border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              showBrush
                ? 'bg-[#242c38] text-[#f5efe3] border-[#e28b37]/70 shadow-xs'
                : 'bg-[#171c24] text-[#6d7580] border-[#2c333f] hover:text-[#9aa1ac]'
            }`}
            title="Isolate a specific segment or mountain pass"
          >
            <ZoomIn className="w-3 h-3 text-[#e28b37]" />
            <span>Range Scrub</span>
          </button>

          {/* Expand Height Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-xs border bg-[#171c24] border-[#2c333f] hover:border-[#6d7580] text-[#9aa1ac] hover:text-[#f5efe3] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            title="Toggle chart expansion height"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3 text-[#d8b34a]" />
                <span>Compact View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 text-[#d8b34a]" />
                <span>Deep Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Toughness & Elevation Summary */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span
            className="px-2 py-0.5 rounded-xs text-[10.5px] font-bold border"
            style={{
              borderColor: `${terrainStats.catColor}40`,
              backgroundColor: `${terrainStats.catColor}15`,
              color: terrainStats.catColor,
            }}
          >
            {terrainStats.climbIndex} m/km · {terrainStats.category}
          </span>
          <span className="text-[#6d7580] hidden md:inline">
            ASL: <b className="text-[#f5efe3]">{minElevationM}m – {maxElevationM}m</b>
          </span>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div
        id={`${idPrefix}-recharts-wrapper`}
        style={{ height: isExpanded ? '380px' : '230px' }}
        className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs p-2 pt-4 relative overflow-hidden transition-all duration-200"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 24, left: -10, bottom: showBrush ? 0 : 6 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const pt = state.activePayload[0].payload as ElevationDataPoint;
                const idx = Number(state.activeTooltipIndex ?? 0);
                onHoverPoint?.({ km: pt.km, ele: pt.ele, grade: pt.grade, index: idx });
              }
            }}
            onMouseLeave={() => {
              onHoverPoint?.(null);
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.65} />
                <stop offset="50%" stopColor={primaryColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#202632" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="km"
              type="number"
              domain={[0, totalDistanceKm]}
              unit=" km"
              stroke="#6d7580"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#2c333f' }}
              tickCount={totalDistanceKm > 100 ? 8 : 6}
            />

            <YAxis
              domain={[yMin, yMax]}
              unit="m"
              stroke="#6d7580"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#2c333f' }}
              tickCount={5}
            />

            {/* Custom Rich Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ElevationDataPoint;
                  const grade = pt.grade;
                  const isClimbing = grade !== undefined && grade > 0;
                  const isSteep = grade !== undefined && Math.abs(grade) >= 6;

                  return (
                    <div className="bg-[#171c24] border border-[#d8b34a]/70 shadow-2xl rounded-xs p-3 text-left space-y-1.5 min-w-[210px] z-50 text-xs pointer-events-none">
                      <div className="flex items-center justify-between border-b border-[#2c333f] pb-1.5">
                        <span className="font-mono font-bold text-[#f5efe3] text-sm">
                          Km {pt.km.toFixed(1)}
                        </span>
                        <span className="font-mono font-bold text-[#d8b34a] bg-[#d8b34a]/15 px-2 py-0.5 rounded-xs border border-[#d8b34a]/30">
                          {pt.ele} m ASL
                        </span>
                      </div>

                      {/* Grade and Incline */}
                      {grade !== undefined && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#9aa1ac]">Grade / Gradient:</span>
                          <span
                            className={`font-mono font-bold ${
                              isSteep
                                ? 'text-[#b5502f]'
                                : isClimbing
                                ? 'text-[#d8b34a]'
                                : 'text-[#7c8f5c]'
                            }`}
                          >
                            {grade > 0 ? `+${grade}%` : `${grade}%`}
                            {isSteep && ' (Steep)'}
                          </span>
                        </div>
                      )}

                      {/* Cumulative stats */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2c333f]/70 text-[10.5px]">
                        <div>
                          <span className="text-[#6d7580] block">Gain to Point:</span>
                          <b className="text-[#d8b34a] font-mono">+{pt.accumulatedGain}m</b>
                        </div>
                        <div>
                          <span className="text-[#6d7580] block">To Finish:</span>
                          <b className="text-[#f5efe3] font-mono">
                            {(totalDistanceKm - pt.km).toFixed(1)} km
                          </b>
                        </div>
                      </div>

                      {/* Landmark or Waypoint callout */}
                      {(pt.label || pt.waypoint) && (
                        <div className="pt-1.5 border-t border-[#2c333f] text-[11px] bg-[#141922] p-1.5 rounded-xs">
                          <div className="font-bold text-[#e28b37] flex items-center gap-1">
                            <span>
                              {pt.waypoint?.type === 'climb'
                                ? '⛰️'
                                : pt.waypoint?.type === 'water'
                                ? '💧'
                                : pt.waypoint?.type === 'finish'
                                ? '🏆'
                                : '📍'}
                            </span>
                            <span className="truncate">{pt.label || pt.waypoint?.name}</span>
                          </div>
                          {pt.waypoint?.notes && (
                            <div className="text-[10px] text-[#9aa1ac] mt-0.5 line-clamp-2">
                              {pt.waypoint.notes}
                            </div>
                          )}
                          {pt.waypoint?.cutoffTime && (
                            <div className="text-[10px] text-[#b5502f] font-semibold mt-0.5">
                              Cut-off gate: {pt.waypoint.cutoffTime}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Main Area Curve */}
            <Area
              type="monotone"
              dataKey="ele"
              stroke={primaryColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 6,
                fill: primaryColor,
                stroke: '#f5efe3',
                strokeWidth: 2,
              }}
            />

            {/* Waypoint Dots */}
            {showWaypoints &&
              milestoneDots.map((item, idx) => {
                const isClimb = item.wp.type === 'climb';
                const isWater = item.wp.type === 'water';
                const isFinish = item.wp.type === 'finish';
                const dotColor = isFinish
                  ? '#e28b37'
                  : isClimb
                  ? '#b5502f'
                  : isWater
                  ? '#4f8fb0'
                  : '#d8b34a';

                return (
                  <ReferenceDot
                    key={`wp-dot-${idx}`}
                    x={item.chartPt.km}
                    y={item.chartPt.ele}
                    r={item.wp.type === 'finish' ? 5 : 4}
                    fill={dotColor}
                    stroke="#12151b"
                    strokeWidth={2}
                    isFront={true}
                  />
                );
              })}

            {/* Optional Zoom / Scrub Brush */}
            {showBrush && (
              <Brush
                dataKey="km"
                height={26}
                stroke={primaryColor}
                fill="#171c24"
                travellerWidth={8}
                tickFormatter={(val: number) => `${Number(val).toFixed(0)}k`}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Terrain Gradient Breakdown Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] text-[#9aa1ac]">
          <span className="font-semibold text-[#f5efe3] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#d8b34a]" />
            Course Gradient Profile
          </span>
          <span className="text-[#6d7580] text-[10px]">
            Hover or scrub elevation line to inspect live incline
          </span>
        </div>

        {/* Stacked Percentage Gradient Bar */}
        <div className="w-full h-2.5 bg-[#171c24] rounded-xs overflow-hidden flex border border-[#2c333f]">
          <div
            style={{ width: `${terrainStats.flatPct}%` }}
            className="bg-[#7c8f5c] h-full transition-all"
            title={`Flat / Rolling (<2.5%): ${terrainStats.flatPct}% of course`}
          />
          <div
            style={{ width: `${terrainStats.rollingPct}%` }}
            className="bg-[#d8b34a] h-full transition-all"
            title={`Moderate Incline (2.5%–5%): ${terrainStats.rollingPct}% of course`}
          />
          <div
            style={{ width: `${terrainStats.steepPct}%` }}
            className="bg-[#e28b37] h-full transition-all"
            title={`Steep Climbs (5%–8%): ${terrainStats.steepPct}% of course`}
          />
          <div
            style={{ width: `${terrainStats.severePct}%` }}
            className="bg-[#b5502f] h-full transition-all"
            title={`Severe Walls (8%+): ${terrainStats.severePct}% of course`}
          />
        </div>

        {/* Legend Chips for Gradient Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] pt-0.5 text-[#9aa1ac]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7c8f5c] shrink-0" />
            <span>Flat &lt;2.5% ({terrainStats.flatPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8b34a] shrink-0" />
            <span>Moderate 2.5–5% ({terrainStats.rollingPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e28b37] shrink-0" />
            <span>Steep 5–8% ({terrainStats.steepPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b5502f] shrink-0" />
            <span>Severe &gt;8% ({terrainStats.severePct}%)</span>
          </div>
        </div>
      </div>

      {/* Interactive Quick-Jump Waypoint Pills */}
      {waypoints.length > 0 && (
        <div className="pt-2 border-t border-[#2c333f]/70">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#6d7580] mb-1.5">
            Jump to Waypoint on Profile:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {waypoints.map((wp, i) => {
              const isSelected = activeWaypoint?.name === wp.name;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectWaypoint(wp)}
                  className={`text-[10.5px] px-2.5 py-1 rounded-xs border shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#d8b34a] text-[#1b1103] border-[#d8b34a] font-bold shadow-xs'
                      : 'bg-[#141922] text-[#9aa1ac] border-[#2c333f] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  <span>
                    {wp.type === 'climb'
                      ? '⛰️'
                      : wp.type === 'water'
                      ? '💧'
                      : wp.type === 'finish'
                      ? '🏆'
                      : '📍'}
                  </span>
                  <span className="truncate max-w-[130px]">{wp.name}</span>
                  <span className="opacity-70 font-mono text-[9.5px]">({wp.km}k)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
