import React, { useState, useMemo } from 'react';
import {
  PROVINCES,
  MAJORS,
  RACES,
  CLUBS,
  DIST_LABEL,
  daysUntil,
  formatRaceDate,
} from '../data/runningData';
import { MajorRace, Discipline } from '../types';
import { ElevationProfile } from './ElevationProfile';
import { NeumorphicButton } from './NeumorphicButton';
import { StoredCommunityRace, transformCommunityRaceToRace } from '../services/communityRaces';
import {
  Calendar,
  ArrowRight,
  MapPin,
  Trophy,
  Sparkles,
  ChevronRight,
  X,
  HelpCircle,
  Footprints,
  Trees,
  Tent,
  Mountain,
  Activity,
  Flag,
  Bike,
} from 'lucide-react';

interface HomeViewProps {
  onSelectProvince: (provId: string) => void;
  onSelectRaceTab: (disc?: string) => void;
  onOpenHowTo?: () => void;
  communityRaces?: StoredCommunityRace[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProvince,
  onSelectRaceTab,
  onOpenHowTo,
  communityRaces = [],
}) => {
  const [selectedMajor, setSelectedMajor] = useState<MajorRace | null>(null);
  const [majorsFilter, setMajorsFilter] = useState<'all' | 'running' | 'cycling'>('all');

  // Compute all merged races for upcoming fixtures
  const allRaces = useMemo(() => {
    const customList = communityRaces.map(transformCommunityRaceToRace);
    return [...customList, ...RACES];
  }, [communityRaces]);

  // Compute next upcoming race
  const upcomingRaces = allRaces.map((r) => ({
    ...r,
    daysLeft: daysUntil(r.date),
  }))
    .filter((r) => r.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const nextRace = upcomingRaces[0];

  const handleMajorClick = (major: MajorRace) => {
    setSelectedMajor((prev) => (prev?.name === major.name ? null : major));
  };

  const getRaceCount = (provId: string) => allRaces.filter((r) => r.prov === provId).length;
  const getClubCount = (provId: string) => CLUBS.filter((c) => c.prov === provId).length;

  const disciplines = [
    {
      id: 'road',
      label: 'Road Running',
      desc: 'Marathons & 10ks',
      count: RACES.filter((r) => (r.discipline || 'road') === 'road').length,
      icon: Flag,
      color: '#e28b37',
    },
    {
      id: 'trail',
      label: 'Trail Running',
      desc: 'Mountain & bush ultras',
      count: RACES.filter((r) => r.discipline === 'trail').length,
      icon: Mountain,
      color: '#7c8f5c',
    },
    {
      id: 'cycling',
      label: 'Cycling Tours',
      desc: 'Road races & MTB stage epics',
      count: RACES.filter((r) => r.discipline === 'cycling').length,
      icon: Bike,
      color: '#06b6d4',
    },
    {
      id: 'walking',
      label: 'Walking',
      desc: 'Sanctioned speed & racewalking',
      count: RACES.filter((r) => r.discipline === 'walking').length,
      icon: Footprints,
      color: '#d8b34a',
    },
    {
      id: 'hiking',
      label: 'Hiking',
      desc: 'Day & weekend alpine trails',
      count: RACES.filter((r) => r.discipline === 'hiking').length,
      icon: Trees,
      color: '#10b981',
    },
    {
      id: 'trekking',
      label: 'Trekking',
      desc: 'Multi-day wilderness expeditions',
      count: RACES.filter((r) => r.discipline === 'trekking').length,
      icon: Tent,
      color: '#c084fc',
    },
    {
      id: 'track',
      label: 'Track & Field',
      desc: 'Stadia & tartan fixtures',
      count: RACES.filter((r) => r.discipline === 'track').length,
      icon: Activity,
      color: '#4f8fb0',
    },
  ];

  return (
    <div id="view-home" className="space-y-8 pb-10 text-left">
      {/* Hero & Next-Up Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Hero Banner (7 cols on Desktop) */}
        <div
          id="home-hero"
          className="lg:col-span-7 relative overflow-hidden rounded-xs border border-[#2c333f] bg-gradient-to-br from-[#1c2230] via-[#171b23] to-[#12151b] p-6 sm:p-8 flex flex-col justify-between"
        >
          <div className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rounded-full bg-radial from-[#e28b37]/25 to-transparent blur-2xl" />

          <div>
            <div
              id="hero-kicker"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#e28b37] mb-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Before First Light · South Africa
            </div>

            <h1
              id="hero-title"
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#f5efe3] tracking-wide leading-tight mt-1 mb-4"
            >
              Find your <br className="hidden sm:inline" />
              next start line.
            </h1>

            <p id="hero-blurb" className="text-sm sm:text-base text-[#9aa1ac] leading-relaxed max-w-xl mb-6">
              Marathons, ultras, mountain trails, walking fixtures, hiking paths, and wilderness trekking
              from the Western Cape to the Highveld — structured the way South African athletics actually works.
            </p>
          </div>

          <div>
            {/* Quick action buttons with tactile Neumorphic styling */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <NeumorphicButton
                variant="primary"
                size="md"
                onClick={() => onSelectRaceTab('all')}
                leftIcon={<Calendar className="w-4 h-4 text-[#1a0f02]" />}
                rightIcon={<ArrowRight className="w-4 h-4 text-[#1a0f02]" />}
              >
                Browse Race Calendar
              </NeumorphicButton>

              {onOpenHowTo && (
                <NeumorphicButton
                  id="home-btn-howto"
                  variant="default"
                  size="md"
                  onClick={onOpenHowTo}
                  leftIcon={<HelpCircle className="w-4 h-4 text-[#d8b34a]" />}
                  className="text-[#d8b34a] hover:text-[#f5efe3] border-[#d8b34a]/40"
                >
                  How To Use Vasbyt
                </NeumorphicButton>
              )}
            </div>

            {/* Stats Row */}
            <div id="hero-stats" className="flex flex-wrap gap-6 sm:gap-8 pt-4 border-t border-[#2c333f]/70">
              <div>
                <b className="font-display text-3xl sm:text-4xl text-[#d8b34a] leading-none block">
                  6
                </b>
                <span className="text-[11px] text-[#6d7580] uppercase tracking-wider block mt-1 font-semibold">
                  Disciplines
                </span>
              </div>
              <div>
                <b className="font-display text-3xl sm:text-4xl text-[#d8b34a] leading-none block">
                  {PROVINCES.length}
                </b>
                <span className="text-[11px] text-[#6d7580] uppercase tracking-wider block mt-1 font-semibold">
                  Provinces Tracked
                </span>
              </div>
              <div>
                <b className="font-display text-3xl sm:text-4xl text-[#d8b34a] leading-none block">
                  {RACES.length}+
                </b>
                <span className="text-[11px] text-[#6d7580] uppercase tracking-wider block mt-1 font-semibold">
                  Official Fixtures
                </span>
              </div>
              <div>
                <b className="font-display text-3xl sm:text-4xl text-[#d8b34a] leading-none block">
                  {CLUBS.length}+
                </b>
                <span className="text-[11px] text-[#6d7580] uppercase tracking-wider block mt-1 font-semibold">
                  Athletics Clubs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Closest on the Calendar Card (5 cols on Desktop) */}
        <div
          id="home-nextup"
          className="lg:col-span-5 flex flex-col justify-between bg-[#171c24] border border-[#2c333f] rounded-xs p-6 sm:p-7 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span
              id="nextup-label"
              className="text-xs uppercase tracking-widest text-[#d8b34a] font-bold flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-[#e28b37]" />
              Closest on the calendar
            </span>
            <span className="text-xs text-[#7c8f5c] bg-[#7c8f5c]/10 border border-[#7c8f5c]/30 px-2 py-0.5 rounded-full font-medium">
              Next Fixture
            </span>
          </div>

          {nextRace ? (
            <div
              id="nextup-card"
              onClick={() => onSelectRaceTab(nextRace.discipline || 'road')}
              className="flex-1 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    id="nextup-countdown"
                    className="font-display font-black text-5xl sm:text-6xl text-[#e28b37] leading-none"
                  >
                    {nextRace.daysLeft}
                  </span>
                  <div>
                    <span className="text-sm uppercase tracking-widest text-[#9aa1ac] font-bold block">
                      Days to Start
                    </span>
                    <span className="text-xs text-[#6d7580]">
                      {formatRaceDate(nextRace.date).day} {formatRaceDate(nextRace.date).mon} 2026
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f5efe3] group-hover:text-[#e28b37] transition-colors leading-tight">
                    {nextRace.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#9aa1ac] flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                  <span>
                    {nextRace.city}, <b className="text-[#f5efe3]">{nextRace.prov.toUpperCase()}</b>
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {/* Discipline indicator */}
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#e28b37]/15 text-[#e28b37] border border-[#e28b37]/40 px-2 py-0.5 rounded-xs">
                    {(nextRace.discipline || 'road').toUpperCase()}
                  </span>
                  {nextRace.dist.map((d) => (
                    <span
                      key={d}
                      className="text-xs uppercase tracking-wider bg-[#242c38] text-[#f5efe3] border border-[#2c333f] px-2.5 py-1 rounded-full font-medium"
                    >
                      {DIST_LABEL[d]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2c333f] flex items-center justify-between text-xs text-[#e28b37] font-semibold">
                <span>View Route Elevation &amp; Details</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ) : (
            <div className="text-sm text-[#6d7580] p-6 bg-[#1b212b] rounded-xs border border-[#2c333f]">
              Calendar refreshing — check the Race Calendar tab.
            </div>
          )}
        </div>
      </div>

      {/* 7 Disciplines of Sport Showcase */}
      <div id="home-disciplines-section" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-wider text-[#f5efe3]">
              7 Disciplines of Sport
            </h2>
            <p className="text-xs sm:text-sm text-[#9aa1ac] mt-0.5">
              Explore events, trails, and clubs across all supported endurance and sporting categories throughout South Africa.
            </p>
          </div>
          <button
            onClick={() => onSelectRaceTab('all')}
            className="text-xs text-[#e28b37] hover:underline font-semibold hidden sm:inline-flex items-center gap-1"
          >
            All Events →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {disciplines.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                id={`discipline-card-${item.id}`}
                onClick={() => onSelectRaceTab(item.id)}
                className="p-3.5 bg-[#171c24] border border-[#2c333f] hover:border-[#e28b37] rounded-xs text-left transition-all hover:bg-[#1f2633] group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-8 h-8 rounded-xs flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}50` }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-[#f5efe3] group-hover:text-[#e28b37] transition-colors leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-[#6d7580] mt-1 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2.5 mt-2 border-t border-[#2c333f]/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-[#9aa1ac]">
                    {item.count} {item.count === 1 ? 'event' : 'events'}
                  </span>
                  <span className="text-[#e28b37] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Majors Grid - 4 Columns on Desktop */}
      <div id="home-majors">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#6d7580] font-bold">
              National Endurance Classics
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-[#f5efe3] mt-0.5">
              The South African Majors
            </h3>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setMajorsFilter('all')}
              className={`text-xs px-3 py-1 rounded-xs font-semibold transition-colors cursor-pointer ${
                majorsFilter === 'all'
                  ? 'bg-[#e28b37] text-black font-bold'
                  : 'bg-[#171c24] text-[#9aa1ac] border border-[#2c333f] hover:border-[#6d7580]'
              }`}
            >
              All Majors ({MAJORS.length})
            </button>
            <button
              onClick={() => setMajorsFilter('running')}
              className={`text-xs px-3 py-1 rounded-xs font-semibold transition-colors cursor-pointer ${
                majorsFilter === 'running'
                  ? 'bg-[#e28b37] text-black font-bold'
                  : 'bg-[#171c24] text-[#9aa1ac] border border-[#2c333f] hover:border-[#6d7580]'
              }`}
            >
              Running Classics ({MAJORS.filter((m) => m.discipline !== 'cycling').length})
            </button>
            <button
              onClick={() => setMajorsFilter('cycling')}
              className={`text-xs px-3 py-1 rounded-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                majorsFilter === 'cycling'
                  ? 'bg-[#06b6d4] text-black font-bold'
                  : 'bg-[#171c24] text-[#9aa1ac] border border-[#2c333f] hover:border-[#06b6d4]'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Cycling Tours ({MAJORS.filter((m) => m.discipline === 'cycling').length})
            </button>
          </div>
        </div>

        <div
          id="majors-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {MAJORS.filter((m) => {
            if (majorsFilter === 'running') return m.discipline !== 'cycling';
            if (majorsFilter === 'cycling') return m.discipline === 'cycling';
            return true;
          }).map((m) => {
            const isSelected = selectedMajor?.name === m.name;
            const isCycling = m.discipline === 'cycling';
            return (
              <div
                key={m.name}
                id={`major-card-${m.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleMajorClick(m)}
                className={`bg-[#171c24] border rounded-xs p-5 text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? isCycling
                      ? 'border-[#06b6d4] bg-[#13222a] ring-1 ring-[#06b6d4]'
                      : 'border-[#e28b37] bg-[#221c17] ring-1 ring-[#e28b37]'
                    : isCycling
                    ? 'border-[#2c333f] hover:border-[#06b6d4] hover:bg-[#1b222d]'
                    : 'border-[#2c333f] hover:border-[#6d7580] hover:bg-[#1b222d]'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span
                      className={`font-display font-black text-3xl sm:text-4xl leading-none ${
                        isCycling ? 'text-[#06b6d4]' : 'text-[#b5502f]'
                      }`}
                    >
                      {m.since}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isCycling ? (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#06b6d4]/40 text-[#06b6d4] bg-[#06b6d4]/10 font-bold flex items-center gap-1">
                          <Bike className="w-3 h-3" />
                          Cycling
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#e28b37]/30 text-[#e28b37] bg-[#e28b37]/10 font-bold">
                          Running
                        </span>
                      )}
                      <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#a86526] text-[#e28b37] bg-[#242c38] font-bold">
                        {m.prov.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-[#f5efe3] mb-2 leading-snug">
                    {m.name}
                  </h4>

                  <p className="text-xs text-[#9aa1ac] leading-relaxed mb-4 line-clamp-3">
                    {m.blurb}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2c333f]/70 flex flex-wrap gap-1.5 items-center justify-between text-xs">
                  <span className={`font-bold ${isCycling ? 'text-[#06b6d4]' : 'text-[#d8b34a]'}`}>
                    {m.dist}
                  </span>
                  <span className="text-[#6d7580]">{m.when}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Major Detail Box */}
        {selectedMajor && (
          <div
            id="major-detail-expanded"
            className="mt-4 p-5 sm:p-6 bg-[#171c24] border border-[#a86526] rounded-xs text-left animate-in fade-in duration-200 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#2c333f]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#f5efe3] leading-none font-bold">
                    {selectedMajor.name}
                  </h3>
                  <span className="text-xs bg-[#e28b37]/20 text-[#e28b37] border border-[#e28b37]/40 px-2 py-0.5 rounded-xs font-bold">
                    {selectedMajor.dist}
                  </span>
                </div>
                <span className="text-xs text-[#d8b34a] tracking-wider uppercase font-semibold mt-1 block">
                  Founded {selectedMajor.since} · Scheduled: {selectedMajor.when} · {selectedMajor.prov.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedMajor(null)}
                className="inline-flex items-center gap-1.5 text-xs text-[#9aa1ac] hover:text-[#f5efe3] px-3 py-1.5 bg-[#242c38] rounded-xs border border-[#2c333f] cursor-pointer self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" />
                Close Profile
              </button>
            </div>

            <p className="text-sm text-[#9aa1ac] leading-relaxed mb-4">{selectedMajor.blurb}</p>

            {selectedMajor.route && (
              <ElevationProfile
                route={selectedMajor.route}
                raceName={selectedMajor.name}
                city={selectedMajor.city}
                prov={selectedMajor.prov}
                discipline={selectedMajor.discipline}
                organiser={selectedMajor.organiser}
                site={selectedMajor.site}
                raceDate={selectedMajor.when}
                idPrefix="major-profile"
              />
            )}
          </div>
        )}
      </div>

      {/* Nine Provinces, One Long Road */}
      <div id="home-provinces-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#6d7580] font-bold">
              Provincial Federations
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-[#f5efe3] mt-0.5">
              Nine Provinces, One Long Road
            </h3>
          </div>
          <button
            onClick={() => onSelectProvince('all')}
            className="text-xs text-[#e28b37] hover:underline font-semibold"
          >
            Explore all provinces →
          </button>
        </div>

        <div
          id="home-prov-grid"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {PROVINCES.map((p) => (
            <button
              key={p.id}
              id={`home-prov-${p.id}`}
              onClick={() => onSelectProvince(p.id)}
              className="bg-[#171c24] border border-[#2c333f] rounded-xs p-4 sm:p-5 text-left cursor-pointer hover:border-[#e28b37] hover:bg-[#201a14] transition-all group"
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-display font-black text-3xl text-[#d8b34a] leading-none group-hover:text-[#e28b37] transition-colors">
                  {p.ab}
                </span>
                <span className="text-[10px] text-[#6d7580] uppercase tracking-wider font-mono">
                  ASA
                </span>
              </div>
              <span className="text-sm font-bold text-[#f5efe3] block leading-snug">
                {p.name}
              </span>
              <span className="text-xs text-[#6d7580] block mt-1.5">
                <b className="text-[#9aa1ac]">{getRaceCount(p.id)}</b> races ·{' '}
                <b className="text-[#9aa1ac]">{getClubCount(p.id)}</b> clubs
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
