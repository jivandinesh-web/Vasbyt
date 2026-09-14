import React, { useState } from 'react';
import { EnrichedRaceRoute, generateGPX, generateTCX, downloadFile } from '../utils/routeData';
import {
  Watch,
  Download,
  Check,
  Smartphone,
  ExternalLink,
  Zap,
  RefreshCw,
  X,
  Compass,
  Mountain,
  Droplets,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

export type WatchBrand = 'garmin' | 'apple' | 'polar' | 'coros';

interface WatchSyncModalProps {
  raceName: string;
  route: EnrichedRaceRoute;
  isOpen: boolean;
  onClose: () => void;
  defaultBrand?: WatchBrand;
}

export const WatchSyncModal: React.FC<WatchSyncModalProps> = ({
  raceName,
  route,
  isOpen,
  onClose,
  defaultBrand = 'garmin',
}) => {
  const [activeBrand, setActiveBrand] = useState<WatchBrand>(defaultBrand);
  const [syncStatus, setSyncStatus] = useState<Record<WatchBrand, 'idle' | 'syncing' | 'synced'>>({
    garmin: 'idle',
    apple: 'idle',
    polar: 'idle',
    coros: 'idle',
  });
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  if (!isOpen) return null;

  const brands: {
    id: WatchBrand;
    name: string;
    badge: string;
    color: string;
    accentBg: string;
    accentBorder: string;
    ecosystem: string;
    deviceExamples: string;
    connectUrl?: string;
  }[] = [
    {
      id: 'garmin',
      name: 'Garmin',
      badge: 'Connect™',
      color: '#007cc3',
      accentBg: 'bg-[#007cc3]/10',
      accentBorder: 'border-[#007cc3]/40',
      ecosystem: 'Garmin Connect & IQ Courses',
      deviceExamples: 'Forerunner 965/265 · Fenix 8/7 · Epix · Enduro',
      connectUrl: 'https://connect.garmin.com/modern/course/import',
    },
    {
      id: 'apple',
      name: 'Apple Watch',
      badge: 'Workouts',
      color: '#e28b37',
      accentBg: 'bg-[#e28b37]/10',
      accentBorder: 'border-[#e28b37]/40',
      ecosystem: 'Apple Health & Workouts Route',
      deviceExamples: 'Apple Watch Ultra 2 · Series 10 / 9 · SE',
      connectUrl: 'https://support.apple.com/en-za/guide/watch/apda752ef9c7/watchos',
    },
    {
      id: 'polar',
      name: 'Polar',
      badge: 'Flow™',
      color: '#d1242a',
      accentBg: 'bg-[#d1242a]/10',
      accentBorder: 'border-[#d1242a]/40',
      ecosystem: 'Polar Flow Route Navigation',
      deviceExamples: 'Vantage V3 · Grit X Pro 2 · Pacer Pro',
      connectUrl: 'https://flow.polar.com/',
    },
    {
      id: 'coros',
      name: 'Coros',
      badge: 'Training Hub',
      color: '#ff6600',
      accentBg: 'bg-[#ff6600]/10',
      accentBorder: 'border-[#ff6600]/40',
      ecosystem: 'Coros App Course Navigation',
      deviceExamples: 'Pace 3 · Apex 2 Pro · Vertix 2',
      connectUrl: 'https://training.coros.com/',
    },
  ];

  const currentBrand = brands.find((b) => b.id === activeBrand) || brands[0];

  const handleTriggerSync = (brandId: WatchBrand) => {
    setSyncStatus((prev) => ({ ...prev, [brandId]: 'syncing' }));

    setTimeout(() => {
      setSyncStatus((prev) => ({ ...prev, [brandId]: 'synced' }));
    }, 1400);
  };

  const handleDownloadGPX = () => {
    const gpxContent = generateGPX(raceName, route);
    const filename = `${raceName.replace(/[^a-zA-Z0-9]/g, '_')}_Route.gpx`;
    downloadFile(filename, gpxContent, 'application/gpx+xml');
  };

  const handleDownloadTCX = () => {
    const tcxContent = generateTCX(raceName, route);
    const filename = `${raceName.replace(/[^a-zA-Z0-9]/g, '_')}_Course.tcx`;
    downloadFile(filename, tcxContent, 'application/vnd.garmin.tcx+xml');
  };

  return (
    <div
      id="watch-sync-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="watch-sync-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#171c24] border border-[#a86526] rounded-xs max-w-2xl w-full text-left shadow-2xl overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#241a10] via-[#1a1f29] to-[#12151b] p-5 sm:p-6 border-b border-[#2c333f] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Watch className="w-4 h-4 text-[#e28b37]" />
              <span className="text-xs uppercase tracking-widest text-[#e28b37] font-bold">
                GPS Watch Course Sync
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#f5efe3] uppercase leading-none">
              {raceName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#9aa1ac] mt-2 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-[#f5efe3]">
                <Compass className="w-3.5 h-3.5 text-[#d8b34a]" />
                {route.distanceKm} km {route.courseType}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-[#e28b37]" />
                +{route.totalAscentM}m climb
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#4f8fb0]" />
                {route.waterTablesCount} hydration stations
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#9aa1ac] hover:text-[#f5efe3] p-1.5 rounded-xs hover:bg-[#2c333f]/60 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Selector Bar */}
        <div className="grid grid-cols-4 bg-[#12151b] border-b border-[#2c333f] p-1.5 gap-1.5">
          {brands.map((b) => {
            const isSelected = activeBrand === b.id;
            const isSynced = syncStatus[b.id] === 'synced';

            return (
              <button
                key={b.id}
                onClick={() => setActiveBrand(b.id)}
                className={`py-2.5 px-2 rounded-xs flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1b222d] border-[#e28b37] text-[#f5efe3] shadow-md'
                    : 'border-transparent text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#171c24]'
                }`}
              >
                <span className="font-bold text-xs sm:text-sm leading-none">{b.name}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#6d7580] mt-0.5 font-semibold flex items-center gap-1">
                  {isSynced ? <Check className="w-3 h-3 text-[#7c8f5c]" /> : b.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Brand Action Panel */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Brand Status & One-Click Cloud/Bluetooth Sync */}
          <div className="bg-[#12151b] border border-[#2c333f] rounded-xs p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#f5efe3]">
                    {currentBrand.name} Navigation Course
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#242c38] text-[#9aa1ac] font-mono">
                    {currentBrand.ecosystem}
                  </span>
                </div>
                <p className="text-xs text-[#6d7580] mt-1">
                  Compatible with {currentBrand.deviceExamples}
                </p>
              </div>

              {/* Direct Sync Button */}
              <button
                onClick={() => handleTriggerSync(currentBrand.id)}
                disabled={syncStatus[currentBrand.id] === 'syncing'}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                  syncStatus[currentBrand.id] === 'synced'
                    ? 'bg-[#7c8f5c] text-[#12151b] hover:bg-[#8da369]'
                    : 'bg-[#e28b37] text-[#1b1103] hover:bg-[#eb9a4a]'
                }`}
              >
                {syncStatus[currentBrand.id] === 'syncing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#1b1103]" />
                    <span>Syncing Course...</span>
                  </>
                ) : syncStatus[currentBrand.id] === 'synced' ? (
                  <>
                    <Check className="w-4 h-4 text-[#12151b]" />
                    <span>Synced to {currentBrand.name}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#1b1103]" />
                    <span>Sync to {currentBrand.name} Watch</span>
                  </>
                )}
              </button>
            </div>

            {/* Sync Progress or Success Notice */}
            {syncStatus[currentBrand.id] === 'syncing' && (
              <div className="mt-4 pt-3 border-t border-[#2c333f]">
                <div className="flex items-center justify-between text-xs text-[#9aa1ac] mb-1.5">
                  <span>Transferring route coordinates &amp; elevation cues...</span>
                  <span className="font-mono text-[#e28b37]">65%</span>
                </div>
                <div className="w-full bg-[#242c38] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#e28b37] h-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}

            {syncStatus[currentBrand.id] === 'synced' && (
              <div className="mt-4 pt-3 border-t border-[#2c333f] flex items-center gap-2 text-xs text-[#7c8f5c] font-medium animate-in fade-in">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Course transferred! Turn-by-turn waypoints and {route.waterTablesCount} water
                  stations are now ready in your {currentBrand.name} device library.
                </span>
              </div>
            )}
          </div>

          {/* Quick File Downloads Row */}
          <div>
            <div className="text-xs uppercase tracking-wider text-[#6d7580] font-semibold mb-2.5 flex items-center justify-between">
              <span>Standard Course File Downloads</span>
              <span className="text-[10.5px] text-[#9aa1ac]">Works with all GPS running devices</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GPX Download */}
              <button
                onClick={handleDownloadGPX}
                className="bg-[#1b212b] border border-[#2c333f] hover:border-[#e28b37] hover:bg-[#202733] p-3 rounded-xs text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-[#f5efe3] flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#e28b37] group-hover:translate-y-0.5 transition-transform" />
                    Download Course .GPX
                  </div>
                  <div className="text-[10px] text-[#6d7580] mt-0.5">
                    Includes trackpoints, elevation &amp; aid waypoints
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#12151b] border border-[#2c333f] px-2 py-0.5 rounded-xs text-[#d8b34a]">
                  .GPX
                </span>
              </button>

              {/* TCX Download */}
              <button
                onClick={handleDownloadTCX}
                className="bg-[#1b212b] border border-[#2c333f] hover:border-[#e28b37] hover:bg-[#202733] p-3 rounded-xs text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-[#f5efe3] flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#d8b34a] group-hover:translate-y-0.5 transition-transform" />
                    Download Training .TCX
                  </div>
                  <div className="text-[10px] text-[#6d7580] mt-0.5">
                    Course cues with climb alerts &amp; lap targets
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#12151b] border border-[#2c333f] px-2 py-0.5 rounded-xs text-[#d8b34a]">
                  .TCX
                </span>
              </button>
            </div>
          </div>

          {/* Brand-Specific Instructions / QR Code */}
          <div className="bg-[#12151b] border border-[#2c333f] rounded-xs p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#d8b34a]">
                How to load onto {currentBrand.name}:
              </span>
              <button
                onClick={() => setShowQrCode((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] text-[#e28b37] hover:underline cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                {showQrCode ? 'Hide QR Code' : 'Scan via Mobile Phone'}
              </button>
            </div>

            {showQrCode ? (
              <div className="p-4 bg-[#171c24] border border-[#2c333f] rounded-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Simulated QR Code SVG */}
                <div className="w-24 h-24 bg-[#f5efe3] p-2 rounded-xs flex items-center justify-center shrink-0">
                  <div className="w-full h-full border-4 border-[#12151b] p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-3.5 h-3.5 bg-[#12151b]"></div>
                      <div className="w-3.5 h-3.5 bg-[#12151b]"></div>
                    </div>
                    <div className="text-[8px] font-black text-[#12151b] uppercase text-center font-mono">
                      BFL-GPS
                    </div>
                    <div className="flex justify-between">
                      <div className="w-3.5 h-3.5 bg-[#12151b]"></div>
                      <div className="w-3.5 h-3.5 bg-[#e28b37]"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <b className="text-sm text-[#f5efe3] block">
                    Scan with your iPhone or Android Camera
                  </b>
                  <p className="text-[#9aa1ac] mt-1 text-[11px] leading-relaxed">
                    Instantly opens the route file in the {currentBrand.name} companion app on your
                    phone to push course cues directly to your watch via Bluetooth.
                  </p>
                </div>
              </div>
            ) : (
              <ol className="list-decimal pl-4 text-[#9aa1ac] space-y-1.5 leading-relaxed">
                {currentBrand.id === 'garmin' && (
                  <>
                    <li>
                      Download the <b>.GPX</b> or <b>.TCX</b> file above.
                    </li>
                    <li>
                      In the <b>Garmin Connect Mobile App</b> (or Garmin Connect Web), go to{' '}
                      <i>Training &amp; Planning &gt; Courses &gt; Import</i>.
                    </li>
                    <li>
                      Select this file, name it &quot;{raceName}&quot;, and tap{' '}
                      <b>Send to Device</b>.
                    </li>
                    <li>
                      On your Garmin watch, choose your Run activity &gt; Options &gt; Navigation
                      &gt; Courses &gt; <b>{raceName}</b>.
                    </li>
                  </>
                )}

                {currentBrand.id === 'apple' && (
                  <>
                    <li>
                      Download the <b>.GPX</b> file above to your iPhone / iCloud Drive.
                    </li>
                    <li>
                      Share the file to the <b>Workouts</b> app (watchOS 10+) or companion GPS
                      apps like <i>WorkOutDoors</i> or <i>HealthFit</i>.
                    </li>
                    <li>
                      In WorkOutDoors or Apple Workouts, select <b>Create Workout Route</b> from
                      the imported GPX.
                    </li>
                    <li>Your route and turn alerts will display directly on your Apple Watch.</li>
                  </>
                )}

                {currentBrand.id === 'polar' && (
                  <>
                    <li>
                      Download the <b>.GPX</b> file above.
                    </li>
                    <li>
                      Log in to <b>Polar Flow Web</b> (flow.polar.com), click the Favorites star
                      icon, and choose <b>Import Route</b>.
                    </li>
                    <li>
                      Check the box to sync the route to your Polar Vantage or Grit X device.
                    </li>
                    <li>
                      Sync your watch via the Polar Flow app or FlowSync to navigate on race day.
                    </li>
                  </>
                )}

                {currentBrand.id === 'coros' && (
                  <>
                    <li>
                      Download the <b>.GPX</b> file above or scan the QR code with your phone.
                    </li>
                    <li>
                      Open the <b>COROS App</b>, go to <i>Profile &gt; Route Library &gt; Import</i>.
                    </li>
                    <li>
                      Select the {raceName} GPX, verify the elevation profile, and tap{' '}
                      <b>Sync with Watch</b>.
                    </li>
                    <li>
                      On your COROS watch, start Run &gt; Navigation &gt; Courses &gt;{' '}
                      <b>{raceName}</b>.
                    </li>
                  </>
                )}
              </ol>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#12151b] px-5 py-3.5 border-t border-[#2c333f] flex items-center justify-between text-xs text-[#6d7580]">
          <span>South Africa Road &amp; Trail Athletics Standard GPS Format</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#f5efe3] bg-[#242c38] hover:bg-[#2c333f] px-4 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
