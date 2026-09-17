import React, { useState, useEffect, useMemo } from 'react';
import { Race, Discipline, DistanceCode } from '../types';
import { DIST_LABEL, formatRaceDate, daysUntil } from '../data/runningData';
import { ElevationProfile } from './ElevationProfile';
import {
  Clock,
  Calendar,
  MapPin,
  Flame,
  Trophy,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Briefcase,
  Activity,
  Mountain,
  Watch,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

interface FavoritedRacesCountdownProps {
  favorites: string[];
  allRaces: Race[];
  onToggleFavorite: (raceName: string) => void;
  onNavigateToRaces: (prov?: string, disc?: string) => void;
  onOpenSyncModal?: (race: Race) => void;
}

interface TimeRemaining {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}

function calculateTimeRemaining(dateStr: string): TimeRemaining {
  // Assume start gun time is 06:00:00 South African Standard Time (UTC+2) on race date
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const target = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10),
    6,
    0,
    0
  );
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  if (totalSeconds <= -86400) {
    return {
      totalSeconds,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      isToday: false,
    };
  }

  if (totalSeconds <= 0 && totalSeconds > -86400) {
    return {
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
      isToday: true,
    };
  }

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    isToday: false,
  };
}

function getTrainingPhase(daysLeft: number): { label: string; tip: string; color: string } {
  if (daysLeft < 0) {
    return {
      label: 'Concluded Fixture',
      tip: 'Event completed! Review your splits and recover well.',
      color: 'text-[#6d7580]',
    };
  }
  if (daysLeft === 0) {
    return {
      label: 'Race Day! Lacing Up',
      tip: 'Today is the day. Stick to your pacing strategy and fuel early.',
      color: 'text-[#e28b37]',
    };
  }
  if (daysLeft <= 7) {
    return {
      label: 'Race Week & Final Taper',
      tip: 'Carb load, prioritize sleep, hydrate, and lay out your kit & bib.',
      color: 'text-[#e28b37]',
    };
  }
  if (daysLeft <= 21) {
    return {
      label: 'Taper Phase',
      tip: 'Reduce volume by 20-30%, keep intensity sharp, and avoid junk miles.',
      color: 'text-[#d8b34a]',
    };
  }
  if (daysLeft <= 60) {
    return {
      label: 'Peak Training Block',
      tip: 'Key weekend long runs, race-pace tempos, and nutrition practice.',
      color: 'text-amber-400',
    };
  }
  return {
    label: 'Base Volume & Endurance Phase',
    tip: 'Build aerobic capacity gradually with steady zone 2 miles and strength work.',
    color: 'text-emerald-400',
  };
}

export const FavoritedRacesCountdown: React.FC<FavoritedRacesCountdownProps> = ({
  favorites,
  allRaces,
  onToggleFavorite,
  onNavigateToRaces,
  onOpenSyncModal,
}) => {
  // Resolve favorited race objects from allRaces
  const favoritedRacesList = useMemo(() => {
    const list = allRaces.filter(
      (r) => favorites.includes(r.name) || (r.id && favorites.includes(r.id))
    );
    // Sort upcoming first (by daysLeft ascending), then past
    return list.sort((a, b) => {
      const daysA = daysUntil(a.date);
      const daysB = daysUntil(b.date);
      if (daysA >= 0 && daysB >= 0) return daysA - daysB;
      if (daysA >= 0 && daysB < 0) return -1;
      if (daysA < 0 && daysB >= 0) return 1;
      return daysB - daysA;
    });
  }, [allRaces, favorites]);

  // Selected race key for active countdown
  const [selectedRaceName, setSelectedRaceName] = useState<string | null>(null);
  const [showElevationProfile, setShowElevationProfile] = useState<boolean>(false);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Keep live tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update selected race if current selection is invalid or null
  useEffect(() => {
    if (favoritedRacesList.length > 0) {
      if (!selectedRaceName || !favoritedRacesList.some((r) => r.name === selectedRaceName)) {
        setSelectedRaceName(favoritedRacesList[0].name);
      }
    } else {
      setSelectedRaceName(null);
    }
  }, [favoritedRacesList, selectedRaceName]);

  const activeRace = useMemo(() => {
    if (!selectedRaceName) return favoritedRacesList[0] || null;
    return favoritedRacesList.find((r) => r.name === selectedRaceName) || favoritedRacesList[0] || null;
  }, [favoritedRacesList, selectedRaceName]);

  const timeRemaining = useMemo(() => {
    if (!activeRace) return null;
    // Dependency on nowTick forces update each second
    void nowTick;
    return calculateTimeRemaining(activeRace.date);
  }, [activeRace, nowTick]);

  const trainingPhase = useMemo(() => {
    if (!activeRace) return null;
    return getTrainingPhase(daysUntil(activeRace.date));
  }, [activeRace]);

  // Suggested popular races for empty state
  const suggestedMarqueeRaces = useMemo(() => {
    const marqueeNames = [
      'Comrades Marathon',
      'Two Oceans Marathon 56k',
      'Absa RUN YOUR CITY CAPE TOWN 10K',
      'JPMorganChase Corporate Challenge Johannesburg',
      'Sanlam Cape Town Marathon',
      'Rosemary Hill Trail Running Series',
    ];
    return allRaces.filter((r) => marqueeNames.includes(r.name) && daysUntil(r.date) >= 0);
  }, [allRaces]);

  const handleDownloadIcs = (race: Race) => {
    const [year, month, day] = race.date.split('-');
    const startDate = `${year}${month}${day}T060000`;
    const endDate = `${year}${month}${day}T120000`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VASBYT South Africa Running Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:vasbyt-race-${race.id || race.name.replace(/\s+/g, '-').toLowerCase()}@vasbyt.co.za`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${race.name}`,
      `DESCRIPTION:VASBYT Fixture: ${race.name} in ${race.city}, ${race.prov.toUpperCase()}. Discipline: ${race.discipline}. Distances: ${race.dist.map((d) => DIST_LABEL[d] || d).join(', ')}. Official website: ${race.site || 'https://vasbyt.co.za'}`,
      `LOCATION:${race.city}, ${race.prov.toUpperCase()}, South Africa`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${race.name.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // If no races favorited, show exciting empty state prompt with 1-click bookmarks
  if (favoritedRacesList.length === 0) {
    return (
      <div
        id="dashboard-countdown-empty"
        className="bg-radial from-[#241c14] to-[#171c24] border border-[#d8b34a]/40 rounded-xs p-5 sm:p-6 text-left shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d8b34a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2c333f]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#d8b34a]/15 text-[#d8b34a] border border-[#d8b34a]/30 rounded-xs">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-wider text-[#f5efe3] leading-none">
                Race Day Target Countdown
              </h3>
              <p className="text-xs text-[#9aa1ac] mt-1">
                Star your target events to activate live countdown tickers, training phases, and race-day readiness tips.
              </p>
            </div>
          </div>

          <button
            id="browse-calendar-for-targets-btn"
            onClick={() => onNavigateToRaces()}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d8b34a] text-[#12151b] font-bold text-xs rounded-xs hover:bg-[#e28b37] transition-colors cursor-pointer shadow-sm"
          >
            <span>Browse Race Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1-Click Quick Target Starter */}
        <div className="mt-4">
          <span className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold block mb-2">
            One-Click Star: Popular South African Targets
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedMarqueeRaces.slice(0, 5).map((r) => (
              <button
                key={r.name}
                id={`quick-star-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => onToggleFavorite(r.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b212b] hover:bg-[#d8b34a]/15 text-[#f5efe3] hover:text-[#d8b34a] border border-[#2c333f] hover:border-[#d8b34a]/50 rounded-xs text-xs font-medium transition-all cursor-pointer group"
                title={`Star ${r.name} to activate countdown`}
              >
                <Star className="w-3.5 h-3.5 text-[#d8b34a] group-hover:fill-[#d8b34a]" />
                <span className="truncate max-w-[180px] sm:max-w-none">{r.name}</span>
                <span className="text-[10px] text-[#6d7580] font-mono">({daysUntil(r.date)}d)</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!activeRace || !timeRemaining) return null;

  const { day, mon, year } = formatRaceDate(activeRace.date);
  const daysLeft = daysUntil(activeRace.date);

  return (
    <div
      id="dashboard-favorited-countdown-card"
      className="bg-linear-to-b from-[#1c222c] to-[#141820] border border-[#a86526] rounded-xs p-5 sm:p-6 text-left shadow-xl relative overflow-hidden"
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#e28b37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar: target title & multi-target selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2c333f]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#d8b34a]/15 text-[#d8b34a] border border-[#d8b34a]/40 rounded-xs">
            <Flame className="w-5 h-5 text-[#e28b37] animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-lg sm:text-2xl uppercase tracking-wider text-[#f5efe3] leading-none">
                Race Day Countdown
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#d8b34a]/15 text-[#d8b34a] border border-[#d8b34a]/40">
                {favoritedRacesList.length} Saved {favoritedRacesList.length === 1 ? 'Target' : 'Targets'}
              </span>
            </div>
            <p className="text-xs text-[#9aa1ac] mt-1">
              Live countdown clock &amp; race preparation tracker for your bookmarked fixtures.
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => onToggleFavorite(activeRace.name)}
            title="Remove from target list"
            className="inline-flex items-center gap-1 text-xs text-[#9aa1ac] hover:text-[#e28b37] bg-[#242c38] px-2.5 py-1.5 rounded-xs border border-[#2c333f] cursor-pointer transition-colors"
          >
            <Star className="w-3.5 h-3.5 fill-[#d8b34a] text-[#d8b34a]" />
            <span className="hidden sm:inline">Bookmarked</span>
          </button>
          <button
            onClick={() => handleDownloadIcs(activeRace)}
            title="Download iCal calendar invite (.ics)"
            className="inline-flex items-center gap-1 text-xs text-[#f5efe3] hover:text-[#d8b34a] bg-[#242c38] hover:bg-[#1b212b] px-2.5 py-1.5 rounded-xs border border-[#2c333f] cursor-pointer transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#d8b34a]" />
            <span>Add to Calendar</span>
          </button>
          {onOpenSyncModal && (
            <button
              onClick={() => onOpenSyncModal(activeRace)}
              title="Sync GPS route to Garmin, Apple Watch, or Suunto"
              className="inline-flex items-center gap-1 text-xs text-[#f5efe3] hover:text-[#e28b37] bg-[#242c38] hover:bg-[#1b212b] px-2.5 py-1.5 rounded-xs border border-[#2c333f] cursor-pointer transition-colors"
            >
              <Watch className="w-3.5 h-3.5 text-[#e28b37]" />
              <span className="hidden sm:inline">Watch GPX</span>
            </button>
          )}
        </div>
      </div>

      {/* Target selector pills if user has multiple favorited events */}
      {favoritedRacesList.length > 1 && (
        <div className="py-3 border-b border-[#2c333f]/70">
          <span className="text-[10px] uppercase tracking-wider text-[#6d7580] font-semibold block mb-1.5">
            Switch Target Race:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {favoritedRacesList.map((r) => {
              const isSelected = r.name === activeRace.name;
              const dLeft = daysUntil(r.date);
              return (
                <button
                  key={r.name}
                  onClick={() => {
                    setSelectedRaceName(r.name);
                    setShowElevationProfile(false);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#d8b34a] border-[#d8b34a] text-[#12151b] font-bold shadow-xs'
                      : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  <span>{r.name}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-[#12151b]' : 'text-[#d8b34a]'}`}>
                    {dLeft < 0 ? 'Concluded' : dLeft === 0 ? 'Today!' : `${dLeft}d`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Focus Area: Race Details & Big Digital Countdown Block */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Race Title, Location & Badges */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-[#d8b34a] bg-[#d8b34a]/15 border border-[#d8b34a]/40 px-2 py-0.5 rounded-xs text-xs">
              {activeRace.prov.toUpperCase()}
            </span>
            <span className="text-xs text-[#9aa1ac] font-medium">{activeRace.city}</span>
            <span className="text-[#6d7580]">·</span>
            <span className="text-xs text-[#f5efe3] font-mono font-semibold">
              {day} {mon} {year}
            </span>

            {activeRace.series && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#d8b34a]/15 text-[#d8b34a] border border-[#d8b34a]/40 px-2 py-0.5 rounded-full font-bold">
                <Award className="w-3 h-3" />
                {activeRace.series}
              </span>
            )}

            {activeRace.isCorporate && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded-full font-bold">
                <Briefcase className="w-3 h-3 text-sky-400" />
                Corporate Event
              </span>
            )}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#f5efe3] leading-tight">
            {activeRace.name}
          </h2>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeRace.dist.map((d) => (
              <span
                key={d}
                className="text-xs uppercase tracking-wider bg-[#242c38] text-[#9aa1ac] border border-[#2c333f] px-2.5 py-0.5 rounded-full font-medium"
              >
                {DIST_LABEL[d]}
              </span>
            ))}
          </div>

          {/* Training Phase & Preparation Guidance Banner */}
          {trainingPhase && (
            <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs mt-3">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d8b34a]" />
                <span className={trainingPhase.color}>{trainingPhase.label}</span>
              </div>
              <p className="text-xs text-[#9aa1ac] leading-relaxed">{trainingPhase.tip}</p>
            </div>
          )}
        </div>

        {/* Right Column: High-Impact Monospace Countdown Clock */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {timeRemaining.isPast ? (
            <div className="text-center py-6 px-4 bg-[#12151b] border border-[#2c333f] rounded-xs w-full">
              <CheckCircle2 className="w-8 h-8 text-[#7c8f5c] mx-auto mb-2" />
              <p className="text-base font-bold text-[#f5efe3]">Race Completed!</p>
              <p className="text-xs text-[#9aa1ac] mt-1">
                This event concluded on {day} {mon} {year}. Check your athlete profile or official race site for results.
              </p>
            </div>
          ) : timeRemaining.isToday ? (
            <div className="text-center py-6 px-4 bg-[#e28b37]/20 border border-[#e28b37] rounded-xs w-full animate-pulse">
              <Flame className="w-10 h-10 text-[#e28b37] mx-auto mb-2" />
              <p className="text-xl font-display font-black uppercase tracking-wider text-[#f5efe3]">
                Race Day is Today!
              </p>
              <p className="text-xs text-[#f5efe3]/90 mt-1 font-medium">
                The gun fires this morning in {activeRace.city}. Give it everything on the road!
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* Days */}
                <div className="bg-[#12151b] border border-[#2c333f] hover:border-[#d8b34a]/60 rounded-xs p-3 sm:p-4 transition-colors">
                  <span className="font-display font-black text-3xl sm:text-5xl text-[#d8b34a] leading-none block font-mono">
                    {String(timeRemaining.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#6d7580] font-bold block mt-2">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="bg-[#12151b] border border-[#2c333f] hover:border-[#d8b34a]/60 rounded-xs p-3 sm:p-4 transition-colors">
                  <span className="font-display font-black text-3xl sm:text-5xl text-[#f5efe3] leading-none block font-mono">
                    {String(timeRemaining.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#6d7580] font-bold block mt-2">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="bg-[#12151b] border border-[#2c333f] hover:border-[#d8b34a]/60 rounded-xs p-3 sm:p-4 transition-colors">
                  <span className="font-display font-black text-3xl sm:text-5xl text-[#f5efe3] leading-none block font-mono">
                    {String(timeRemaining.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#6d7580] font-bold block mt-2">
                    Minutes
                  </span>
                </div>

                {/* Seconds */}
                <div className="bg-[#12151b] border border-[#e28b37]/60 rounded-xs p-3 sm:p-4 transition-colors shadow-inner">
                  <span className="font-display font-black text-3xl sm:text-5xl text-[#e28b37] leading-none block font-mono">
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#e28b37] font-bold block mt-2">
                    Seconds
                  </span>
                </div>
              </div>

              {/* Progress bar or context note */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#9aa1ac] px-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d8b34a]" />
                  <span>Target Gun Time: 06:00 AM SAST</span>
                </span>
                <button
                  onClick={() => onNavigateToRaces(activeRace.prov, activeRace.discipline)}
                  className="text-[#e28b37] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Fixture Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Course Elevation Profile for Target Race */}
      {activeRace.route && (
        <div className="mt-4 pt-4 border-t border-[#2c333f]/70">
          <button
            onClick={() => setShowElevationProfile(!showElevationProfile)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#f5efe3] hover:text-[#d8b34a] py-1 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#d8b34a]" />
              <span>
                {showElevationProfile ? 'Hide Target Elevation Profile' : 'Inspect Target Course & Elevation Profile'}
              </span>
              {activeRace.route.ascentM && (
                <span className="text-[11px] text-[#9aa1ac] font-mono">
                  (+{activeRace.route.ascentM}m / -{activeRace.route.descentM}m)
                </span>
              )}
            </span>
            {showElevationProfile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showElevationProfile && (
            <div className="mt-3 pt-2">
              <ElevationProfile
                route={activeRace.route}
                raceName={activeRace.name}
                city={activeRace.city}
                prov={activeRace.prov}
                discipline={activeRace.discipline}
                organiser={activeRace.organiser}
                site={activeRace.site}
                raceDate={activeRace.date}
                idPrefix="target-countdown"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
