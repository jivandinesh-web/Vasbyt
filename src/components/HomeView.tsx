import React, { useState } from 'react';
import {
  PROVINCES,
  MAJORS,
  RACES,
  CLUBS,
  DIST_LABEL,
  daysUntil,
  formatRaceDate,
} from '../data/runningData';
import { MajorRace } from '../types';
import { ElevationProfile } from './ElevationProfile';
import { Calendar, ArrowRight, MapPin, Trophy, Sparkles, ChevronRight, X, HelpCircle } from 'lucide-react';

interface HomeViewProps {
  onSelectProvince: (provId: string) => void;
  onSelectRaceTab: () => void;
  onOpenHowTo?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProvince,
  onSelectRaceTab,
  onOpenHowTo,
}) => {
  const [selectedMajor, setSelectedMajor] = useState<MajorRace | null>(null);

  // Compute next upcoming race
  const upcomingRaces = RACES.map((r) => ({
    ...r,
    daysLeft: daysUntil(r.date),
  }))
    .filter((r) => r.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const nextRace = upcomingRaces[0];

  const handleMajorClick = (major: MajorRace) => {
    setSelectedMajor((prev) => (prev?.name === major.name ? null : major));
  };

  const getRaceCount = (provId: string) => RACES.filter((r) => r.prov === provId).length;
  const getClubCount = (provId: string) => CLUBS.filter((c) => c.prov === provId).length;

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
              Marathons, ultras, mountain trails, and club time-trials from the Western Cape to the
              Highveld — structured the way South African road and trail running actually works.
            </p>
          </div>

          <div>
            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={onSelectRaceTab}
                className="inline-flex items-center gap-2 bg-[#e28b37] text-[#1b1103] hover:bg-[#eb9a4a] text-sm font-bold px-4 py-2.5 rounded-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Browse Race Calendar
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenHowTo && (
                <button
                  id="home-btn-howto"
                  onClick={onOpenHowTo}
                  className="inline-flex items-center gap-2 bg-[#1b212b] hover:bg-[#242c38] text-[#d8b34a] hover:text-[#f5efe3] border border-[#d8b34a]/40 hover:border-[#d8b34a]/80 text-sm font-bold px-4 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#d8b34a]" />
                  How To Use Vasbyt
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div id="hero-stats" className="flex flex-wrap gap-6 sm:gap-8 pt-4 border-t border-[#2c333f]/70">
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
              onClick={onSelectRaceTab}
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

                <h3 className="text-xl sm:text-2xl font-bold text-[#f5efe3] group-hover:text-[#e28b37] transition-colors leading-tight mb-2">
                  {nextRace.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#9aa1ac] flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
                  <span>
                    {nextRace.city}, <b className="text-[#f5efe3]">{nextRace.prov.toUpperCase()}</b>
                  </span>
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
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

      {/* The Majors Grid - 4 Columns on Desktop */}
      <div id="home-majors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#6d7580] font-bold">
              Heritage Running
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-[#f5efe3] mt-0.5">
              The South African Majors
            </h3>
          </div>
          <span className="text-xs text-[#6d7580]">
            Tap any major for full profile &amp; elevation
          </span>
        </div>

        <div
          id="majors-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {MAJORS.map((m) => {
            const isSelected = selectedMajor?.name === m.name;
            return (
              <div
                key={m.name}
                id={`major-card-${m.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleMajorClick(m)}
                className={`bg-[#171c24] border rounded-xs p-5 text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#e28b37] bg-[#221c17] ring-1 ring-[#e28b37]'
                    : 'border-[#2c333f] hover:border-[#6d7580] hover:bg-[#1b222d]'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-display font-black text-3xl sm:text-4xl text-[#b5502f] leading-none">
                      {m.since}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#a86526] text-[#e28b37] bg-[#242c38] font-bold">
                      {m.prov.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-[#f5efe3] mb-2 leading-snug">
                    {m.name}
                  </h4>

                  <p className="text-xs text-[#9aa1ac] leading-relaxed mb-4 line-clamp-3">
                    {m.blurb}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2c333f]/70 flex flex-wrap gap-1.5 items-center justify-between text-xs">
                  <span className="font-bold text-[#d8b34a]">{m.dist}</span>
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
                prov={selectedMajor.prov}
                discipline={selectedMajor.discipline}
                organiser={selectedMajor.organiser}
                site={selectedMajor.site}
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
