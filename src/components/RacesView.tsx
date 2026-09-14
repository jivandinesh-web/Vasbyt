import React, { useState } from 'react';
import {
  PROVINCES,
  RACES,
  DIST_LABEL,
  daysUntil,
  formatRaceDate,
} from '../data/runningData';
import { DistanceCode, Discipline } from '../types';
import { ElevationProfile } from './ElevationProfile';
import { WatchSyncModal } from './WatchSyncModal';
import { getEnrichedRaceRoute } from '../utils/routeData';
import { Search, ChevronDown, ChevronUp, RotateCcw, Mountain, Activity, Flag, Watch, Compass } from 'lucide-react';

interface RacesViewProps {
  activeProv: string;
  onSelectProv: (prov: string) => void;
  favorites: string[];
  onToggleFavorite: (raceName: string) => void;
}

export const RacesView: React.FC<RacesViewProps> = ({
  activeProv,
  onSelectProv,
  favorites,
  onToggleFavorite,
}) => {
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [activeDist, setActiveDist] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRaceKey, setExpandedRaceKey] = useState<string | null>(null);
  const [syncModalRace, setSyncModalRace] = useState<any | null>(null);

  const provChips = [
    { id: 'all', label: 'All Provinces' },
    ...PROVINCES.map((p) => ({ id: p.id, label: `${p.name} (${p.ab})`, short: p.ab })),
  ];

  const disciplineChips: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'All Disciplines', count: RACES.length },
    { key: 'road', label: 'Road Running', count: RACES.filter((r) => r.discipline === 'road').length },
    { key: 'trail', label: 'Trail Running', count: RACES.filter((r) => r.discipline === 'trail').length },
    { key: 'track', label: 'Track & Field', count: RACES.filter((r) => r.discipline === 'track').length },
  ];

  const distChips: { key: string; label: string }[] = [
    { key: 'all', label: 'All distances' },
    { key: 'X', label: 'Trail Ultra / Mountain' },
    { key: 'U', label: 'Ultra Marathon' },
    { key: 'M', label: 'Marathon (42.2k)' },
    { key: 'H', label: 'Half Marathon (21.1k)' },
    { key: 'T', label: '10km' },
    { key: 'F', label: '5km Fun Run' },
    { key: 'TR', label: 'Track Classic' },
  ];

  let filteredRaces = RACES.map((r) => ({
    ...r,
    daysLeft: daysUntil(r.date),
  }));

  // Province filter
  if (activeProv !== 'all') {
    filteredRaces = filteredRaces.filter((r) => r.prov === activeProv);
  }

  // Discipline filter
  if (activeDiscipline !== 'all') {
    filteredRaces = filteredRaces.filter((r) => r.discipline === (activeDiscipline as Discipline));
  }

  // Distance filter
  if (activeDist !== 'all') {
    filteredRaces = filteredRaces.filter((r) => r.dist.includes(activeDist as DistanceCode));
  }

  // Text search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredRaces = filteredRaces.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.prov.toLowerCase().includes(q) ||
        (r.route.note && r.route.note.toLowerCase().includes(q))
    );
  }

  filteredRaces.sort((a, b) => a.daysLeft - b.daysLeft);

  const hasActiveFilters =
    activeProv !== 'all' || activeDiscipline !== 'all' || activeDist !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setActiveDiscipline('all');
    setActiveDist('all');
    onSelectProv('all');
    setSearchQuery('');
  };

  const toggleRaceExpand = (key: string) => {
    setExpandedRaceKey((prev) => (prev === key ? null : key));
  };

  const getDisciplineBadge = (disc: Discipline) => {
    switch (disc) {
      case 'trail':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#7c8f5c]/20 text-[#7c8f5c] border border-[#7c8f5c]/60 px-2 py-0.5 rounded-xs font-bold">
            <Mountain className="w-3 h-3" />
            Trail
          </span>
        );
      case 'track':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#4f8fb0]/20 text-[#4f8fb0] border border-[#4f8fb0]/60 px-2 py-0.5 rounded-xs font-bold">
            <Activity className="w-3 h-3" />
            Track
          </span>
        );
      case 'road':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#e28b37]/15 text-[#e28b37] border border-[#e28b37]/50 px-2 py-0.5 rounded-xs font-bold">
            <Flag className="w-3 h-3" />
            Road
          </span>
        );
    }
  };

  return (
    <div id="view-races" className="space-y-6 pb-8 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2c333f]">
        <div>
          <div className="flex items-center gap-3">
            <h1
              id="races-pagehead"
              className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-[#f5efe3] leading-none"
            >
              Race Calendar
            </h1>
            <span className="bg-[#242c38] text-[#d8b34a] border border-[#d8b34a]/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {filteredRaces.length} events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1">
            Tap any race to view elevation profile, course route landmarks &amp; official host details.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7580]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search race, town, or mountain…"
            className="w-full bg-[#1b212b] border border-[#2c333f] rounded-xs pl-9 pr-8 py-2 text-sm text-[#f5efe3] placeholder-[#6d7580] focus:outline-none focus:border-[#e28b37]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6d7580] hover:text-[#f5efe3] p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Control Box */}
      <div id="race-filters-card" className="bg-[#171c24] border border-[#2c333f] rounded-xs p-4 space-y-4">
        {/* Disciplines */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold mb-2">
            Discipline
          </div>
          <div id="race-discipline-chips" className="flex flex-wrap gap-2">
            {disciplineChips.map((d) => {
              const isOn = activeDiscipline === d.key;
              return (
                <button
                  key={d.key}
                  id={`chip-discipline-${d.key}`}
                  onClick={() => setActiveDiscipline(d.key)}
                  className={`text-xs sm:text-sm py-1.5 px-3.5 rounded-full border cursor-pointer transition-all ${
                    isOn
                      ? 'bg-[#e28b37] border-[#e28b37] text-[#1b1103] font-bold shadow-xs'
                      : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  {d.label} <span className="opacity-75 text-[11px]">({d.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Provinces */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold mb-2">
            Province
          </div>
          <div id="race-prov-chips" className="flex flex-wrap gap-1.5 sm:gap-2">
            {provChips.map((p) => {
              const isOn = activeProv === p.id;
              return (
                <button
                  key={p.id}
                  id={`chip-race-prov-${p.id}`}
                  onClick={() => onSelectProv(p.id)}
                  className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                    isOn
                      ? 'bg-[#d8b34a] border-[#d8b34a] text-[#1b1103] font-bold shadow-xs'
                      : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Distances */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold mb-2">
            Distance Category
          </div>
          <div id="race-dist-chips" className="flex flex-wrap gap-1.5 sm:gap-2">
            {distChips.map((d) => {
              const isOn = activeDist === d.key;
              return (
                <button
                  key={d.key}
                  id={`chip-race-dist-${d.key}`}
                  onClick={() => setActiveDist(d.key)}
                  className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                    isOn
                      ? 'bg-[#242c38] border-[#e28b37] text-[#e28b37] font-bold shadow-xs'
                      : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Clear Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-[#2c333f]/80 flex items-center justify-between text-xs">
            <span className="text-[#9aa1ac]">
              Active filter: Showing <b className="text-[#f5efe3]">{filteredRaces.length}</b> of{' '}
              {RACES.length} races
            </span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[#e28b37] hover:underline cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Race Cards List */}
      <div id="race-list-container" className="space-y-3 sm:space-y-3.5">
        {filteredRaces.length === 0 ? (
          <div
            id="races-empty"
            className="text-center py-16 px-4 bg-[#171c24] border border-[#2c333f] rounded-xs"
          >
            <p className="text-base text-[#f5efe3] font-semibold mb-1">No matching races found</p>
            <p className="text-xs text-[#6d7580] mb-4">
              Try broadening your discipline, province, or search keyword filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold bg-[#e28b37] text-[#1b1103] px-4 py-2 rounded-xs"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredRaces.map((r) => {
            const { day, mon } = formatRaceDate(r.date);
            const isFav = favorites.includes(r.name);
            const key = `${r.name}-${r.date}`;
            const isOpen = expandedRaceKey === key;

            return (
              <div
                key={key}
                id={`race-row-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => toggleRaceExpand(key)}
                className={`bg-[#171c24] border rounded-xs p-4 sm:p-5 transition-all cursor-pointer ${
                  isOpen
                    ? 'border-[#e28b37]/80 shadow-md bg-[#191f2a]'
                    : 'border-[#2c333f] hover:border-[#6d7580] hover:bg-[#1b222d]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Date badge + Race Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Date Badge */}
                    <div
                      id={`date-badge-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className="flex-none w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center bg-[#12151b] border border-[#2c333f] rounded-xs text-center"
                    >
                      <b className="font-display text-2xl sm:text-3xl leading-none text-[#f5efe3] block">
                        {day}
                      </b>
                      <span className="text-[10px] uppercase tracking-wider text-[#d8b34a] font-bold block mt-0.5">
                        {mon}
                      </span>
                    </div>

                    {/* Race Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-[#f5efe3] leading-snug">
                          {r.name}
                        </h3>
                        {getDisciplineBadge(r.discipline)}
                      </div>

                      <div className="text-xs sm:text-sm text-[#9aa1ac] flex items-center gap-2 flex-wrap mb-2">
                        <span>{r.city}</span>
                        <span>·</span>
                        <span className="font-bold text-[#d8b34a] bg-[#d8b34a]/10 border border-[#d8b34a]/30 px-1.5 py-0.2 rounded-xs text-[11px]">
                          {r.prov.toUpperCase()}
                        </span>
                        <span>·</span>
                        {r.daysLeft < 0 ? (
                          <span className="text-[#6d7580]">Concluded</span>
                        ) : r.daysLeft === 0 ? (
                          <span className="text-[#e28b37] font-bold animate-pulse">Running today!</span>
                        ) : (
                          <span>
                            in <b className="text-[#e28b37] font-semibold">{r.daysLeft} days</b>
                          </span>
                        )}
                      </div>

                      {/* Distance Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {r.dist.map((d) => (
                          <span
                            key={d}
                            className="text-[10px] sm:text-xs uppercase tracking-wider bg-[#242c38] text-[#9aa1ac] border border-[#2c333f] px-2.5 py-0.5 rounded-full font-medium"
                          >
                            {DIST_LABEL[d]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Expand indicator */}
                  <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center flex-wrap">
                    {/* Direct Watch Sync Button on Row */}
                    <button
                      id={`sync-watch-btn-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSyncModalRace(r);
                      }}
                      title="Sync race route & waypoints to Garmin, Apple Watch, Polar, or Coros"
                      className="inline-flex items-center gap-1.5 bg-[#242c38] hover:bg-[#e28b37] hover:text-[#1b1103] text-[#f5efe3] border border-[#2c333f] hover:border-[#e28b37] px-2.5 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <Watch className="w-3.5 h-3.5 text-[#e28b37] group-hover:text-[#1b1103]" />
                      <span className="hidden sm:inline">Sync Watch</span>
                    </button>

                    <button
                      id={`star-race-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(r.name);
                      }}
                      title={isFav ? 'Remove from saved favorites' : 'Add to saved favorites'}
                      className={`w-9 h-9 flex items-center justify-center rounded-xs border text-lg transition-colors ${
                        isFav
                          ? 'bg-[#d8b34a]/20 border-[#d8b34a] text-[#d8b34a]'
                          : 'bg-[#12151b] border-[#2c333f] text-[#6d7580] hover:text-[#f5efe3] hover:border-[#6d7580]'
                      }`}
                    >
                      {isFav ? '★' : '☆'}
                    </button>

                    <div className="flex items-center gap-1 text-xs text-[#6d7580] hover:text-[#f5efe3] font-medium bg-[#12151b] px-3 py-2 rounded-xs border border-[#2c333f]">
                      <span>{isOpen ? 'Hide Profile' : 'Route Profile'}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#e28b37]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Route Details with Elevation Profile & Route Map */}
                {isOpen && (
                  <div
                    id={`race-expanded-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full mt-3 pt-3 border-t border-[#2c333f] animate-in fade-in duration-200"
                  >
                    <ElevationProfile
                      route={r.route}
                      raceName={r.name}
                      city={r.city}
                      prov={r.prov}
                      distCode={r.dist[0]}
                      discipline={r.discipline}
                      organiser={r.organiser}
                      site={r.site}
                      idPrefix={`race-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Row-triggered Watch Sync Modal */}
      {syncModalRace && (
        <WatchSyncModal
          raceName={syncModalRace.name}
          route={getEnrichedRaceRoute(
            syncModalRace.name,
            syncModalRace.city,
            syncModalRace.prov,
            syncModalRace.route,
            syncModalRace.dist[0],
            syncModalRace.discipline
          )}
          isOpen={true}
          onClose={() => setSyncModalRace(null)}
          defaultBrand="garmin"
        />
      )}
    </div>
  );
};
