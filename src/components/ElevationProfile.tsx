import React, { useState, useMemo } from 'react';
import { RouteProfile } from '../types';
import { getEnrichedRaceRoute, generateGPX, downloadFile } from '../utils/routeData';
import { RouteMap } from './RouteMap';
import { WatchSyncModal, WatchBrand } from './WatchSyncModal';
import {
  ExternalLink,
  Compass,
  Mountain,
  Watch,
  Download,
  MapPin,
  Droplets,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  Info,
} from 'lucide-react';

interface ElevationProfileProps {
  route: RouteProfile;
  raceName?: string;
  city?: string;
  prov?: string;
  distCode?: string;
  discipline?: string;
  organiser?: string;
  site?: string;
  idPrefix?: string;
}

export const ElevationProfile: React.FC<ElevationProfileProps> = ({
  route,
  raceName = 'Race Course',
  city = '',
  prov = '',
  distCode = 'M',
  discipline = 'road',
  organiser,
  site,
  idPrefix = 'elevation',
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'elevation' | 'map' | 'cues'>('both');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState<boolean>(false);
  const [selectedWatchBrand, setSelectedWatchBrand] = useState<WatchBrand>('garmin');

  // Retrieve or synthesize enriched route data
  const enriched = useMemo(() => {
    return getEnrichedRaceRoute(raceName, city, prov, route, distCode, discipline);
  }, [raceName, city, prov, route, distCode, discipline]);

  const detailedElevation = enriched.detailedElevation;
  const coordinates = enriched.coordinates;
  const waypoints = enriched.waypoints;

  // Elevation Chart Math
  const w = 720;
  const h = 180;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 24;
  const padBottom = 28;

  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const minEle = Math.max(0, Math.floor((enriched.minEleM * 0.9) / 50) * 50);
  const maxEle = Math.ceil((enriched.maxEleM * 1.1) / 50) * 50;
  const eleRange = Math.max(100, maxEle - minEle);
  const totalDist = enriched.distanceKm;

  // Map each elevation point to SVG coordinates
  const svgPoints = detailedElevation.map((pt, i) => {
    const x = padLeft + (pt.km / (totalDist || 1)) * chartW;
    const y = padTop + chartH - ((pt.ele - minEle) / eleRange) * chartH;
    return { ...pt, x, y, index: i };
  });

  const pathD = svgPoints
    .map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1))
    .join(' ');

  const areaD =
    svgPoints.length > 0
      ? pathD +
        ` L${svgPoints[svgPoints.length - 1].x.toFixed(1)},${padTop + chartH} L${svgPoints[0].x.toFixed(1)},${padTop + chartH} Z`
      : '';

  // Active hover data
  const activePt = hoveredPointIndex !== null ? svgPoints[hoveredPointIndex] : null;
  const activeCoordinate =
    hoveredPointIndex !== null && coordinates[hoveredPointIndex]
      ? coordinates[hoveredPointIndex]
      : null;

  const handleOpenSyncModal = (brand: WatchBrand = 'garmin') => {
    setSelectedWatchBrand(brand);
    setIsWatchModalOpen(true);
  };

  const handleQuickDownloadGPX = (e: React.MouseEvent) => {
    e.stopPropagation();
    const gpx = generateGPX(raceName, enriched);
    const fname = `${raceName.replace(/[^a-zA-Z0-9]/g, '_')}_Route.gpx`;
    downloadFile(fname, gpx, 'application/gpx+xml');
  };

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = w / rect.width;
    const svgX = clientX * scaleX;

    if (svgX < padLeft || svgX > w - padRight) {
      setHoveredPointIndex(null);
      return;
    }

    // Find nearest point
    let closestIdx = 0;
    let closestDist = Infinity;

    svgPoints.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setHoveredPointIndex(closestIdx);
  };

  return (
    <div
      id={`${idPrefix}-container`}
      className="w-full bg-[#171c24] border border-[#2c333f] rounded-xs p-4 sm:p-5 text-left shadow-lg space-y-4"
    >
      {/* Top Bar: Organiser info & Watch Sync CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#2c333f]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-xs uppercase tracking-widest text-[#e28b37] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Official Course Profile &amp; Route Map
            </span>
            {enriched.qualifierFor && (
              <span className="hidden sm:inline text-[9.5px] uppercase tracking-wider bg-[#7c8f5c]/20 text-[#7c8f5c] border border-[#7c8f5c]/40 px-2 py-0.2 rounded-full font-bold">
                Qualifier
              </span>
            )}
          </div>

          <div className="text-xs text-[#9aa1ac] mt-1 flex items-center gap-2 flex-wrap">
            {organiser && (
              <span>
                Host: <b className="text-[#f5efe3] font-semibold">{organiser}</b>
              </span>
            )}
            {site && (
              <a
                href={site.startsWith('http') ? site : `https://${site}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-xs text-[#e28b37] hover:underline"
              >
                <span>{site}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons: Sync to Watch + Quick GPX */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Watch Sync Button */}
          <button
            onClick={() => handleOpenSyncModal('garmin')}
            id={`${idPrefix}-sync-btn`}
            className="inline-flex items-center gap-2 bg-[#e28b37] hover:bg-[#eb9a4a] text-[#1b1103] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xs shadow-md transition-all cursor-pointer group"
          >
            <Watch className="w-4 h-4 text-[#1b1103] group-hover:rotate-12 transition-transform" />
            <span>Sync to Watch</span>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider bg-[#1b1103]/20 px-1.5 py-0.2 rounded-xs font-mono font-black">
              Garmin · Apple · Polar · Coros
            </span>
          </button>

          {/* Quick GPX Download */}
          <button
            onClick={handleQuickDownloadGPX}
            title="Download route GPX file for GPS watches & navigation apps"
            className="inline-flex items-center gap-1.5 bg-[#242c38] hover:bg-[#2c333f] text-[#f5efe3] border border-[#2c333f] font-semibold text-xs px-3 py-2 rounded-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#d8b34a]" />
            <span>.GPX</span>
          </button>
        </div>
      </div>

      {/* Course Key Specs Strip */}
      <div
        id={`${idPrefix}-specs-grid`}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-[#12151b] border border-[#2c333f] p-2.5 rounded-xs text-center"
      >
        <div className="p-1.5">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Distance
          </span>
          <b className="font-display text-base sm:text-lg text-[#f5efe3] block leading-tight">
            {enriched.distanceKm} km
          </b>
          <span className="text-[9px] text-[#9aa1ac]">{enriched.courseType}</span>
        </div>

        <div className="p-1.5 border-l border-[#2c333f]/60">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Elevation Gain
          </span>
          <b className="font-display text-base sm:text-lg text-[#d8b34a] block leading-tight">
            +{enriched.totalAscentM} m
          </b>
          <span className="text-[9px] text-[#7c8f5c]">Ascent</span>
        </div>

        <div className="p-1.5 border-l border-[#2c333f]/60">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Descent
          </span>
          <b className="font-display text-base sm:text-lg text-[#9aa1ac] block leading-tight">
            −{enriched.totalDescentM} m
          </b>
          <span className="text-[9px] text-[#6d7580]">Loss</span>
        </div>

        <div className="p-1.5 border-l border-[#2c333f]/60">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Max Altitude
          </span>
          <b className="font-display text-base sm:text-lg text-[#e28b37] block leading-tight">
            {enriched.maxEleM} m
          </b>
          <span className="text-[9px] text-[#6d7580]">Above Sea Level</span>
        </div>

        <div className="p-1.5 border-l border-[#2c333f]/60">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Water Stations
          </span>
          <b className="font-display text-base sm:text-lg text-[#4f8fb0] block leading-tight">
            {enriched.waterTablesCount} Tables
          </b>
          <span className="text-[9px] text-[#6d7580]">Hydration</span>
        </div>

        <div className="p-1.5 border-l border-[#2c333f]/60">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Cut-Off Time
          </span>
          <b className="font-display text-base sm:text-lg text-[#b5502f] block leading-tight">
            {enriched.cutoffTime}
          </b>
          <span className="text-[9px] text-[#6d7580]">Official Limit</span>
        </div>

        <div className="p-1.5 border-l border-[#2c333f]/60 col-span-2 sm:col-span-1">
          <span className="text-[9px] uppercase tracking-wider text-[#6d7580] font-semibold block">
            Terrain Surface
          </span>
          <b className="font-display text-xs sm:text-sm text-[#f5efe3] block leading-tight truncate">
            {enriched.surface}
          </b>
          <span className="text-[9px] text-[#7c8f5c]">Certified Route</span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-[#2c333f] pb-2 flex-wrap">
        <div className="flex items-center gap-1 bg-[#12151b] p-1 rounded-xs border border-[#2c333f]">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              viewMode === 'both'
                ? 'bg-[#e28b37] text-[#1b1103]'
                : 'text-[#9aa1ac] hover:text-[#f5efe3]'
            }`}
          >
            Overview (Split)
          </button>
          <button
            onClick={() => setViewMode('elevation')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              viewMode === 'elevation'
                ? 'bg-[#e28b37] text-[#1b1103]'
                : 'text-[#9aa1ac] hover:text-[#f5efe3]'
            }`}
          >
            Elevation Profile
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#e28b37] text-[#1b1103]'
                : 'text-[#9aa1ac] hover:text-[#f5efe3]'
            }`}
          >
            Route Map
          </button>
          <button
            onClick={() => setViewMode('cues')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              viewMode === 'cues'
                ? 'bg-[#e28b37] text-[#1b1103]'
                : 'text-[#9aa1ac] hover:text-[#f5efe3]'
            }`}
          >
            Course Cues ({waypoints.length})
          </button>
        </div>

        <div className="text-[11px] text-[#6d7580] hidden sm:flex items-center gap-1">
          <Info className="w-3 h-3 text-[#e28b37]" />
          <span>Hover or scrub along elevation chart to track live position on map</span>
        </div>
      </div>

      {/* Main Content Area (Split / Map / Elevation / Cues) */}
      <div className="space-y-4">
        {/* Split or Map View */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5efe3] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e28b37]" />
                Geospatial Route Map
              </span>
              <span className="text-[10px] text-[#6d7580]">
                Interactive course track &amp; aid checkpoints
              </span>
            </div>

            <RouteMap
              coordinates={coordinates}
              waypoints={waypoints}
              activeCoordinate={activeCoordinate}
              raceName={raceName}
              height={viewMode === 'map' ? '460px' : '320px'}
            />
          </div>
        )}

        {/* Split or Elevation View */}
        {(viewMode === 'both' || viewMode === 'elevation') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#d8b34a] flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-[#e28b37]" />
                  Elevation Profile &amp; Gradients
                </span>
                {activePt && (
                  <span className="text-[11px] text-[#e28b37] font-mono font-bold bg-[#e28b37]/15 px-2 py-0.5 rounded-xs border border-[#e28b37]/30 animate-in fade-in">
                    Km {activePt.km} · {activePt.ele}m ASL {activePt.grade ? `(${activePt.grade > 0 ? '+' : ''}${activePt.grade}% grade)` : ''}
                    {activePt.label ? ` · ${activePt.label}` : ''}
                  </span>
                )}
              </div>

              <span className="text-[10px] text-[#6d7580]">
                Range: {minEle}m — {maxEle}m ASL
              </span>
            </div>

            {/* SVG Elevation Profile Chart */}
            <div
              id={`${idPrefix}-chart-container`}
              className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs p-3 overflow-hidden relative select-none"
            >
              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="w-full h-auto block cursor-crosshair"
                onMouseMove={handleChartMouseMove}
                onMouseLeave={() => setHoveredPointIndex(null)}
                role="img"
                aria-label={`${raceName} elevation profile chart`}
              >
                <defs>
                  <linearGradient id={`${idPrefix}-chart-grad`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e28b37" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#e28b37" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#e28b37" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const yVal = padTop + chartH * (1 - ratio);
                  const eleVal = Math.round(minEle + ratio * eleRange);
                  return (
                    <g key={ratio}>
                      <line
                        x1={padLeft}
                        y1={yVal}
                        x2={w - padRight}
                        y2={yVal}
                        stroke="#242c38"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                      />
                      <text
                        x={padLeft - 6}
                        y={yVal + 3}
                        fontSize="8.5"
                        fill="#6d7580"
                        textAnchor="end"
                        fontFamily="'Work Sans', sans-serif"
                      >
                        {eleVal}m
                      </text>
                    </g>
                  );
                })}

                {/* Vertical distance grid lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio) => {
                  const xVal = padLeft + chartW * ratio;
                  const kmVal = Math.round(totalDist * ratio);
                  return (
                    <g key={ratio}>
                      <line
                        x1={xVal}
                        y1={padTop}
                        x2={xVal}
                        y2={padTop + chartH}
                        stroke="#242c38"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                      />
                      <text
                        x={xVal}
                        y={h - 8}
                        fontSize="9"
                        fill="#6d7580"
                        textAnchor="middle"
                        fontFamily="'Work Sans', sans-serif"
                      >
                        {kmVal} km
                      </text>
                    </g>
                  );
                })}

                {/* Start km label */}
                <text
                  x={padLeft}
                  y={h - 8}
                  fontSize="9"
                  fill="#6d7580"
                  textAnchor="start"
                  fontFamily="'Work Sans', sans-serif"
                >
                  0 km
                </text>

                {/* Area under curve */}
                <path d={areaD} fill={`url(#${idPrefix}-chart-grad)`} />

                {/* Main elevation line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#e28b37"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Waypoint markers on curve */}
                {svgPoints.map((p, i) => {
                  if (p.label && (i === 0 || i === svgPoints.length - 1 || p.grade! > 5 || p.grade! < -5)) {
                    return (
                      <g key={`pt-${i}`}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill="#d8b34a"
                          stroke="#12151b"
                          strokeWidth="2"
                        />
                        <text
                          x={p.x}
                          y={p.y - 8}
                          fontSize="8"
                          fontWeight="700"
                          fill="#f5efe3"
                          textAnchor={i === 0 ? 'start' : i === svgPoints.length - 1 ? 'end' : 'middle'}
                          fontFamily="'Work Sans', sans-serif"
                        >
                          {p.label}
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}

                {/* Active Hover vertical line & circle */}
                {activePt && (
                  <g>
                    <line
                      x1={activePt.x}
                      y1={padTop}
                      x2={activePt.x}
                      y2={padTop + chartH}
                      stroke="#f5efe3"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={activePt.x}
                      cy={activePt.y}
                      r="6"
                      fill="#e28b37"
                      stroke="#f5efe3"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Profile Note */}
            {route.note && (
              <div
                id={`${idPrefix}-note`}
                className="text-xs text-[#9aa1ac] italic leading-relaxed bg-[#1b212b]/60 p-3 rounded-xs border border-[#2c333f]/60"
              >
                <span className="text-[#e28b37] font-semibold not-italic">Route Insights: </span>
                {route.note}
              </div>
            )}
          </div>
        )}

        {/* Turn-by-turn Cues & Waypoints tab */}
        {(viewMode === 'cues' || viewMode === 'both') && (
          <div className="bg-[#12151b] border border-[#2c333f] rounded-xs p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#2c333f]">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#f5efe3] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7c8f5c]" />
                Key Course Waypoints &amp; Hydration Stations ({waypoints.length})
              </span>
              <span className="text-[10px] text-[#6d7580]">
                Pre-programmed in GPS watch course file
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {waypoints.map((wp, idx) => (
                <div
                  key={idx}
                  className="bg-[#171c24] border border-[#2c333f] p-2.5 rounded-xs flex items-start justify-between text-xs"
                >
                  <div className="flex items-start gap-2 min-w-0 pr-2">
                    <span className="text-sm shrink-0 mt-0.5">
                      {wp.type === 'start'
                        ? '🏁'
                        : wp.type === 'finish'
                        ? '🏆'
                        : wp.type === 'water'
                        ? '💧'
                        : wp.type === 'climb'
                        ? '⛰️'
                        : wp.type === 'cutoff'
                        ? '⏱️'
                        : '📍'}
                    </span>
                    <div className="truncate">
                      <b className="text-[#f5efe3] block truncate">{wp.name}</b>
                      <span className="text-[11px] text-[#9aa1ac]">
                        Km {wp.km} · Altitude: <b>{wp.ele}m ASL</b>
                      </span>
                      {wp.notes && (
                        <span className="text-[10px] text-[#6d7580] block truncate mt-0.5">
                          {wp.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {wp.cutoffTime && (
                    <span className="text-[9.5px] uppercase font-bold text-[#b5502f] bg-[#b5502f]/15 border border-[#b5502f]/30 px-1.5 py-0.5 rounded-xs shrink-0">
                      {wp.cutoffTime}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Course Directions */}
            {route.directions && route.directions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#2c333f]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#d8b34a] block mb-2">
                  Official Course Directions &amp; Turn-by-Turn
                </span>
                <ul className="list-disc pl-4 text-xs text-[#9aa1ac] space-y-1.5">
                  {route.directions.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Watch Sync Modal Dialog */}
      <WatchSyncModal
        raceName={raceName}
        route={enriched}
        isOpen={isWatchModalOpen}
        onClose={() => setIsWatchModalOpen(false)}
        defaultBrand={selectedWatchBrand}
      />
    </div>
  );
};
