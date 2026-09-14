import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CourseWaypoint } from '../types';
import { Layers, Maximize2, Minimize2, Navigation, Droplets, Mountain, Clock } from 'lucide-react';

interface RouteMapProps {
  coordinates: [number, number][]; // [lat, lng]
  waypoints?: CourseWaypoint[];
  activeCoordinate?: [number, number] | null;
  raceName: string;
  className?: string;
  height?: string;
}

type MapTheme = 'dark' | 'topo' | 'satellite' | 'street';

function getTileConfig(theme: MapTheme) {
  switch (theme) {
    case 'dark':
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 19,
          className: 'map-tiles-dark',
          attribution: '&copy; OpenStreetMap contributors',
        },
      };
    case 'topo':
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 18,
          attribution: '&copy; Esri World Topo Map',
        },
      };
    case 'satellite':
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 18,
          attribution: '&copy; Esri World Imagery',
        },
      };
    case 'street':
    default:
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        },
      };
  }
}

export const RouteMap: React.FC<RouteMapProps> = ({
  coordinates,
  waypoints = [],
  activeCoordinate,
  raceName,
  className = '',
  height = '360px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const polylineGlowRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const activeMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<MapTheme>('dark');
  const [showWaterStations, setShowWaterStations] = useState<boolean>(true);
  const [showClimbs, setShowClimbs] = useState<boolean>(true);
  const [showCutoffs, setShowCutoffs] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (coordinates.length === 0) return;

    // Center on first coordinate or bounds center
    const startCoord = coordinates[0];

    const map = L.map(mapContainerRef.current, {
      center: startCoord,
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Custom Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; Esri')
      .addTo(map);

    mapRef.current = map;

    // Free, un-keyed tile layer with zero watermark
    const cfg = getTileConfig(mapTheme);
    const tiles = L.tileLayer(cfg.url, cfg.options).addTo(map);
    tileLayerRef.current = tiles;

    // Markers Layer Group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Invalidate size on load
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile theme
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const cfg = getTileConfig(mapTheme);
    const tiles = L.tileLayer(cfg.url, cfg.options).addTo(mapRef.current);
    tiles.bringToBack();
    tileLayerRef.current = tiles;
  }, [mapTheme]);

  // Draw Polylines & Fit Bounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map || coordinates.length === 0) return;

    // Remove existing polylines
    if (polylineRef.current) map.removeLayer(polylineRef.current);
    if (polylineGlowRef.current) map.removeLayer(polylineGlowRef.current);

    const latLngs = coordinates.map(([lat, lng]) => L.latLng(lat, lng));

    // Outer glow track
    const glow = L.polyline(latLngs, {
      color: '#e28b37',
      weight: 8,
      opacity: 0.28,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    polylineGlowRef.current = glow;

    // Main sharp track
    const poly = L.polyline(latLngs, {
      color: '#e28b37',
      weight: 3.5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    polylineRef.current = poly;

    // Fit map bounds to track with padding
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
  }, [coordinates]);

  // Render Waypoint Markers
  useEffect(() => {
    const markersLayer = markersLayerRef.current;
    if (!markersLayer) return;

    markersLayer.clearLayers();

    waypoints.forEach((wp) => {
      // Filter out unwanted types
      if (wp.type === 'water' && !showWaterStations) return;
      if (wp.type === 'climb' && !showClimbs) return;
      if (wp.type === 'cutoff' && !showCutoffs) return;

      let iconHtml = '';
      let iconSize: [number, number] = [28, 28];
      let iconAnchor: [number, number] = [14, 14];

      if (wp.type === 'start') {
        iconSize = [32, 32];
        iconAnchor = [16, 16];
        iconHtml = `
          <div class="w-8 h-8 rounded-full bg-[#7c8f5c] border-2 border-[#f5efe3] shadow-lg flex items-center justify-center text-[#12151b] font-black text-xs">
            🏁
          </div>
        `;
      } else if (wp.type === 'finish') {
        iconSize = [32, 32];
        iconAnchor = [16, 16];
        iconHtml = `
          <div class="w-8 h-8 rounded-full bg-[#d8b34a] border-2 border-[#12151b] shadow-lg flex items-center justify-center text-[#12151b] font-black text-xs">
            🏆
          </div>
        `;
      } else if (wp.type === 'climb') {
        iconSize = [26, 26];
        iconAnchor = [13, 13];
        iconHtml = `
          <div class="w-6.5 h-6.5 rounded-full bg-[#e28b37] border-2 border-[#12151b] shadow-md flex items-center justify-center text-[#12151b] font-black text-[10px]">
            ⛰️
          </div>
        `;
      } else if (wp.type === 'water') {
        iconSize = [22, 22];
        iconAnchor = [11, 11];
        iconHtml = `
          <div class="w-5.5 h-5.5 rounded-full bg-[#4f8fb0] border border-[#f5efe3] shadow-sm flex items-center justify-center text-[#f5efe3] text-[9px] font-bold">
            💧
          </div>
        `;
      } else if (wp.type === 'cutoff') {
        iconSize = [24, 24];
        iconAnchor = [12, 12];
        iconHtml = `
          <div class="w-6 h-6 rounded-full bg-[#b5502f] border-2 border-[#f5efe3] shadow-md flex items-center justify-center text-[#f5efe3] text-[9px] font-bold">
            ⏱️
          </div>
        `;
      } else {
        iconSize = [20, 20];
        iconAnchor = [10, 10];
        iconHtml = `
          <div class="w-5 h-5 rounded-full bg-[#242c38] border border-[#e28b37] shadow-sm flex items-center justify-center text-[#e28b37] text-[8px] font-bold">
            📍
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-route-marker',
        html: iconHtml,
        iconSize,
        iconAnchor,
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Work Sans', sans-serif; min-width: 160px; color: #12151b; line-height: 1.35;">
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px; color: #12151b;">${wp.name}</div>
          <div style="font-size: 11px; color: #555; margin-bottom: 4px;">
            <b>Km ${wp.km}</b> · Altitude: <b>${wp.ele}m ASL</b>
          </div>
          ${wp.cutoffTime ? `<div style="font-size: 10.5px; color: #b5502f; font-weight: 600;">Cutoff: ${wp.cutoffTime}</div>` : ''}
          ${wp.notes ? `<div style="font-size: 10.5px; color: #333; margin-top: 2px;">${wp.notes}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -8] });
      markersLayer.addLayer(marker);
    });
  }, [waypoints, showWaterStations, showClimbs, showCutoffs]);

  // Synchronize Active Coordinate Marker (from elevation hover)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!activeCoordinate) {
      if (activeMarkerRef.current) {
        map.removeLayer(activeMarkerRef.current);
        activeMarkerRef.current = null;
      }
      return;
    }

    const [lat, lng] = activeCoordinate;

    const pulseIcon = L.divIcon({
      className: 'route-active-pulse-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-7 h-7 rounded-full bg-[#e28b37] opacity-60 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-[#e28b37] border-2 border-[#f5efe3] shadow-md z-10"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (!activeMarkerRef.current) {
      const marker = L.marker([lat, lng], { icon: pulseIcon, zIndexOffset: 1000 }).addTo(map);
      activeMarkerRef.current = marker;
    } else {
      activeMarkerRef.current.setLatLng([lat, lng]);
    }
  }, [activeCoordinate]);

  const handleFitBounds = () => {
    if (!mapRef.current || coordinates.length === 0) return;
    const latLngs = coordinates.map(([lat, lng]) => L.latLng(lat, lng));
    mapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative w-full rounded-xs overflow-hidden border border-[#2c333f] bg-[#12151b] ${
        isExpanded ? 'fixed inset-4 sm:inset-10 z-50 shadow-2xl border-[#e28b37]' : ''
      } ${className}`}
      style={{ height: isExpanded ? 'calc(100vh - 5rem)' : height }}
    >
      {/* Top Map Action Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Course Label Pill */}
        <div className="pointer-events-auto bg-[#171c24]/90 backdrop-blur-sm border border-[#2c333f] px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-[#e28b37]" />
          <span className="text-[11px] font-bold text-[#f5efe3] uppercase tracking-wider truncate max-w-[180px] sm:max-w-xs">
            {raceName} Route Track
          </span>
          <span className="text-[10px] text-[#9aa1ac]">({coordinates.length} pts)</span>
        </div>

        {/* Quick Map Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#171c24]/90 backdrop-blur-sm border border-[#2c333f] p-1 rounded-xs shadow-md">
          {/* Layer switcher with label */}
          <div className="flex items-center gap-0.5 bg-[#12151b] rounded-xs p-0.5 border border-[#2c333f]">
            {(
              [
                { id: 'dark', label: 'Dark' },
                { id: 'topo', label: 'Topo' },
                { id: 'satellite', label: 'Satellite' },
                { id: 'street', label: 'Street' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setMapTheme(t.id)}
                className={`px-1.5 py-0.5 rounded-xs text-[10px] font-semibold transition-colors cursor-pointer ${
                  mapTheme === t.id
                    ? 'bg-[#e28b37] text-[#1b1103]'
                    : 'text-[#9aa1ac] hover:text-[#f5efe3]'
                }`}
                title={`Switch to ${t.label} basemap (No API key needed)`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Reset Bounds */}
          <button
            onClick={handleFitBounds}
            title="Recenter & fit full course"
            className="px-2 py-0.5 rounded-xs text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#242c38] transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
          >
            Fit
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={handleToggleExpand}
            title={isExpanded ? 'Minimize map' : 'Expand full map'}
            className="p-1 rounded-xs text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#242c38] transition-colors cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Filter Chips Overlay */}
      <div className="absolute bottom-2.5 left-2.5 z-[1000] flex flex-wrap items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setShowWaterStations((prev) => !prev)}
          className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
            showWaterStations
              ? 'bg-[#171c24]/90 text-[#4f8fb0] border-[#4f8fb0]/50'
              : 'bg-[#171c24]/60 text-[#6d7580] border-[#2c333f]'
          }`}
        >
          <Droplets className="w-2.5 h-2.5" />
          Water
        </button>

        <button
          onClick={() => setShowClimbs((prev) => !prev)}
          className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
            showClimbs
              ? 'bg-[#171c24]/90 text-[#e28b37] border-[#e28b37]/50'
              : 'bg-[#171c24]/60 text-[#6d7580] border-[#2c333f]'
          }`}
        >
          <Mountain className="w-2.5 h-2.5" />
          Climbs
        </button>

        <button
          onClick={() => setShowCutoffs((prev) => !prev)}
          className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
            showCutoffs
              ? 'bg-[#171c24]/90 text-[#b5502f] border-[#b5502f]/50'
              : 'bg-[#171c24]/60 text-[#6d7580] border-[#2c333f]'
          }`}
        >
          <Clock className="w-2.5 h-2.5" />
          Cutoffs
        </button>
      </div>

      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
