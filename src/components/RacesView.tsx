import React, { useState, useMemo } from 'react';
import {
  PROVINCES,
  RACES,
  DIST_LABEL,
  daysUntil,
  formatRaceDate,
  RUNNING_SERIES_LIST,
} from '../data/runningData';
import { DistanceCode, Discipline, Race, CommunityRaceSubmission } from '../types';
import { ElevationProfile } from './ElevationProfile';
import { WatchSyncModal } from './WatchSyncModal';
import { getEnrichedRaceRoute } from '../utils/routeData';
import {
  transformCommunityRaceToRace,
  StoredCommunityRace,
  getRaceDeduplicationKey,
  mergeRacesWithOverrides,
} from '../services/communityRaces';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Mountain,
  Activity,
  Flag,
  Watch,
  Compass,
  Footprints,
  Trees,
  Tent,
  CloudSun,
  Sparkles,
  Users,
  AlertTriangle,
  CalendarX,
  CloudRain,
  RefreshCw,
  UserX,
  Award,
  Briefcase,
  MapPin,
} from 'lucide-react';

interface RacesViewProps {
  activeProv: string;
  onSelectProv: (prov: string) => void;
  favorites: string[];
  onToggleFavorite: (raceName: string) => void;
  activeDiscipline?: string;
  onSelectDiscipline?: (disc: string) => void;
  communityRaces?: StoredCommunityRace[];
  onAddRace?: (submission: CommunityRaceSubmission) => Promise<void>;
  onDeleteCommunityRace?: (raceId: string) => Promise<void>;
}

export const RacesView: React.FC<RacesViewProps> = ({
  activeProv,
  onSelectProv,
  favorites,
  onToggleFavorite,
  activeDiscipline: controlledDiscipline,
  onSelectDiscipline,
  communityRaces = [],
  onAddRace,
  onDeleteCommunityRace,
}) => {
  const { user, isAdmin } = useAuth();
  const [internalDiscipline, setInternalDiscipline] = useState<string>('all');
  const activeDiscipline = controlledDiscipline !== undefined ? controlledDiscipline : internalDiscipline;
  const setActiveDiscipline = (disc: string) => {
    setInternalDiscipline(disc);
    if (onSelectDiscipline) {
      onSelectDiscipline(disc);
    }
  };
  const [activeDist, setActiveDist] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'official' | 'community'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [seriesFilter, setSeriesFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRaceKey, setExpandedRaceKey] = useState<string | null>(null);
  const [expandedRaceTab, setExpandedRaceTab] = useState<Record<string, 'both' | 'elevation' | 'map' | 'cues' | 'weather'>>({});
  const [syncModalRace, setSyncModalRace] = useState<any | null>(null);

  // Merge static official races with dynamically fetched community races
  // Strictly deduplicate and honor admin event overrides (name changes, cancellations, postponements)
  const allRaces = useMemo(() => {
    return mergeRacesWithOverrides(communityRaces, RACES);
  }, [communityRaces]);

  const corporateRacesCount = useMemo(() => allRaces.filter((r) => r.isCorporate).length, [allRaces]);
  const seriesRacesCount = useMemo(() => allRaces.filter((r) => !!r.series).length, [allRaces]);

  // Extract all unique calendar years available across all fixtures
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allRaces.forEach((r) => {
      const { year } = formatRaceDate(r.date);
      if (year && !isNaN(year)) years.add(year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [allRaces]);

  const provChips = [
    { id: 'all', label: 'All Provinces' },
    ...PROVINCES.map((p) => ({ id: p.id, label: `${p.name} (${p.ab})`, short: p.ab })),
  ];

  const hasDiscipline = (r: Race, disc: Discipline) =>
    r.disciplines && r.disciplines.length > 0 ? r.disciplines.includes(disc) : r.discipline === disc;

  const disciplineChips: { key: string; label: string; count: number }[] = [
    { key: 'all', label: 'All Disciplines', count: allRaces.length },
    { key: 'road', label: 'Road Running', count: allRaces.filter((r) => hasDiscipline(r, 'road')).length },
    { key: 'trail', label: 'Trail Running', count: allRaces.filter((r) => hasDiscipline(r, 'trail')).length },
    { key: 'cycling', label: 'Cycling Tours', count: allRaces.filter((r) => hasDiscipline(r, 'cycling')).length },
    { key: 'track', label: 'Track & Field', count: allRaces.filter((r) => hasDiscipline(r, 'track')).length },
    { key: 'walking', label: 'Walking', count: allRaces.filter((r) => hasDiscipline(r, 'walking')).length },
    { key: 'hiking', label: 'Hiking', count: allRaces.filter((r) => hasDiscipline(r, 'hiking')).length },
    { key: 'trekking', label: 'Trekking', count: allRaces.filter((r) => hasDiscipline(r, 'trekking')).length },
  ];

  const distChips: { key: string; label: string }[] = [
    { key: 'all', label: 'All distances' },
    { key: 'CY', label: 'Cycling Tour / Stage' },
    { key: 'X', label: 'Trail Ultra / Mountain' },
    { key: 'U', label: 'Ultra Marathon' },
    { key: 'M', label: 'Marathon (42.2k)' },
    { key: 'H', label: 'Half Marathon (21.1k)' },
    { key: 'T', label: '10km' },
    { key: 'F', label: '5km Fun Run' },
    { key: 'TR', label: 'Track Classic' },
    { key: 'WK', label: 'Walking (5k - 50k)' },
    { key: 'HK', label: 'Mountain Hike' },
    { key: 'TK', label: 'Wilderness Trek' },
  ];

  let filteredRaces = allRaces.map((r) => ({
    ...r,
    daysLeft: daysUntil(r.date),
  }));

  // Province filter
  if (activeProv !== 'all') {
    filteredRaces = filteredRaces.filter((r) => r.prov === activeProv);
  }

  // Discipline filter
  if (activeDiscipline !== 'all') {
    filteredRaces = filteredRaces.filter((r) => hasDiscipline(r, activeDiscipline as Discipline));
  }

  // Distance filter
  if (activeDist !== 'all') {
    filteredRaces = filteredRaces.filter((r) => r.dist.includes(activeDist as DistanceCode));
  }

  // Source filter (all vs official vs community submitted)
  if (sourceFilter === 'community') {
    filteredRaces = filteredRaces.filter((r) => r.isCommunity);
  } else if (sourceFilter === 'official') {
    filteredRaces = filteredRaces.filter((r) => !r.isCommunity);
  }

  // Calendar Year filter
  if (yearFilter !== 'all') {
    filteredRaces = filteredRaces.filter((r) => {
      const { year } = formatRaceDate(r.date);
      return String(year) === yearFilter;
    });
  }

  // Series / Corporate filter
  if (seriesFilter === 'corporate') {
    filteredRaces = filteredRaces.filter((r) => r.isCorporate);
  } else if (seriesFilter === 'all_series') {
    filteredRaces = filteredRaces.filter((r) => !!r.series);
  } else if (seriesFilter !== 'all') {
    filteredRaces = filteredRaces.filter((r) => r.series === seriesFilter);
  }

  // Text search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredRaces = filteredRaces.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.prov.toLowerCase().includes(q) ||
        (r.disciplines && r.disciplines.some((d) => d.toLowerCase().includes(q))) ||
        r.discipline.toLowerCase().includes(q) ||
        (r.series && r.series.toLowerCase().includes(q)) ||
        (r.organiser && r.organiser.toLowerCase().includes(q)) ||
        (r.isCorporate && 'corporate'.includes(q)) ||
        (r.route.note && r.route.note.toLowerCase().includes(q))
    );
  }

  // Sort: upcoming races chronologically first, then past races
  filteredRaces.sort((a, b) => {
    if (a.daysLeft >= 0 && b.daysLeft >= 0) {
      return a.daysLeft - b.daysLeft;
    }
    if (a.daysLeft >= 0 && b.daysLeft < 0) {
      return -1;
    }
    if (a.daysLeft < 0 && b.daysLeft >= 0) {
      return 1;
    }
    return b.daysLeft - a.daysLeft;
  });

  const hasActiveFilters =
    activeProv !== 'all' ||
    activeDiscipline !== 'all' ||
    activeDist !== 'all' ||
    sourceFilter !== 'all' ||
    yearFilter !== 'all' ||
    seriesFilter !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setActiveDiscipline('all');
    setActiveDist('all');
    setSourceFilter('all');
    setYearFilter('all');
    setSeriesFilter('all');
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
      case 'walking':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#d8b34a]/20 text-[#d8b34a] border border-[#d8b34a]/60 px-2 py-0.5 rounded-xs font-bold">
            <Footprints className="w-3 h-3" />
            Walking
          </span>
        );
      case 'hiking':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/60 px-2 py-0.5 rounded-xs font-bold">
            <Trees className="w-3 h-3" />
            Hiking
          </span>
        );
      case 'trekking':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/60 px-2 py-0.5 rounded-xs font-bold">
            <Tent className="w-3 h-3" />
            Trekking
          </span>
        );
      case 'cycling':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/60 px-2 py-0.5 rounded-xs font-bold">
            <Compass className="w-3 h-3" />
            Cycling
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

  const renderDisciplineBadges = (race: Race) => {
    const list: Discipline[] =
      race.disciplines && race.disciplines.length > 0
        ? race.disciplines
        : [race.discipline];
    return list.map((d) => (
      <React.Fragment key={d}>{getDisciplineBadge(d)}</React.Fragment>
    ));
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
        <div className="relative w-full sm:w-72">
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6d7580] hover:text-[#f5efe3] p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Province Feedback Banner */}
      {activeProv !== 'all' && (
        <div
          id="active-province-banner"
          className="bg-[#1b212b] border border-[#d8b34a]/40 p-3 sm:p-3.5 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#d8b34a]/15 border border-[#d8b34a]/35 flex items-center justify-center text-[#d8b34a] font-display font-black text-sm shrink-0">
              {PROVINCES.find((p) => p.id === activeProv)?.ab || activeProv.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#6d7580] uppercase tracking-wider font-semibold">
                  Province Filter:
                </span>
                <h2 className="text-sm sm:text-base font-bold text-[#f5efe3] leading-none">
                  {PROVINCES.find((p) => p.id === activeProv)?.name || activeProv}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#d8b34a]/20 text-[#d8b34a] border border-[#d8b34a]/30">
                  {filteredRaces.length} event{filteredRaces.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-[#9aa1ac] mt-0.5 line-clamp-1">
                {PROVINCES.find((p) => p.id === activeProv)?.blurb}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectProv('all')}
            className="inline-flex items-center gap-1.5 text-xs text-[#d8b34a] hover:text-[#f5efe3] px-2.5 py-1.5 bg-[#242c38] border border-[#3d4756] hover:border-[#d8b34a] rounded-xs cursor-pointer transition-colors self-start sm:self-auto shrink-0 font-medium"
            title="Show all provinces"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Show all provinces</span>
          </button>
        </div>
      )}

      {/* Filter Control Box */}
      <div id="race-filters-card" className="bg-[#171c24] border border-[#2c333f] rounded-xs p-4 space-y-4">
        {/* Source Filter (All / Official / Community Added) */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#2c333f]/60">
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold">
            Calendar Source
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSourceFilter('all')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                sourceFilter === 'all'
                  ? 'bg-[#f5efe3] border-[#f5efe3] text-[#12151b] font-bold'
                  : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:text-[#f5efe3]'
              }`}
            >
              All Fixtures ({allRaces.length})
            </button>
            <button
              onClick={() => setSourceFilter('official')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                sourceFilter === 'official'
                  ? 'bg-[#e28b37] border-[#e28b37] text-[#12151b] font-bold'
                  : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:text-[#f5efe3]'
              }`}
            >
              Official Major ({RACES.length})
            </button>
            <button
              onClick={() => setSourceFilter('community')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                sourceFilter === 'community'
                  ? 'bg-[#d8b34a] border-[#d8b34a] text-[#12151b] font-bold'
                  : 'bg-[#1b212b] border-[#2c333f] text-[#d8b34a] hover:border-[#d8b34a]/60'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Community Added ({communityRaces.length})</span>
            </button>
          </div>
        </div>

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

        {/* Calendar Year Filter */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold mb-2 flex items-center justify-between">
            <span>Calendar Year</span>
            {yearFilter !== 'all' && (
              <button
                onClick={() => setYearFilter('all')}
                className="text-[10px] text-[#e28b37] hover:underline cursor-pointer"
              >
                Reset Year
              </button>
            )}
          </div>
          <div id="race-year-chips" className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              id="chip-race-year-all"
              onClick={() => setYearFilter('all')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                yearFilter === 'all'
                  ? 'bg-[#f5efe3] border-[#f5efe3] text-[#12151b] font-bold shadow-xs'
                  : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
              }`}
            >
              All Years
            </button>
            {availableYears.map((yr) => {
              const isOn = yearFilter === String(yr);
              const countInYear = allRaces.filter((r) => formatRaceDate(r.date).year === yr).length;
              return (
                <button
                  key={yr}
                  id={`chip-race-year-${yr}`}
                  onClick={() => setYearFilter(String(yr))}
                  className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                    isOn
                      ? 'bg-[#d8b34a] border-[#d8b34a] text-[#1b1103] font-bold shadow-xs'
                      : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                  }`}
                >
                  {yr} <span className="text-[10px] opacity-75 font-mono">({countInYear})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Corporate & Popular Running Series Filter */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#d8b34a]" />
              Corporate &amp; Popular Running Series
            </span>
            {seriesFilter !== 'all' && (
              <button
                onClick={() => setSeriesFilter('all')}
                className="text-[10px] text-[#d8b34a] hover:underline cursor-pointer font-medium"
              >
                Reset Series
              </button>
            )}
          </div>
          <div id="race-series-chips" className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              id="chip-series-all"
              onClick={() => setSeriesFilter('all')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all ${
                seriesFilter === 'all'
                  ? 'bg-[#f5efe3] border-[#f5efe3] text-[#12151b] font-bold shadow-xs'
                  : 'bg-[#1b212b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
              }`}
            >
              All Events ({allRaces.length})
            </button>
            <button
              id="chip-series-all-series"
              onClick={() => setSeriesFilter('all_series')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                seriesFilter === 'all_series'
                  ? 'bg-[#d8b34a] border-[#d8b34a] text-[#12151b] font-bold shadow-xs'
                  : 'bg-[#1b212b] border-[#d8b34a]/40 text-[#d8b34a] hover:bg-[#1b212b]/80'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>All 14 Running Series ({seriesRacesCount})</span>
            </button>
            <button
              id="chip-series-corporate"
              onClick={() => setSeriesFilter('corporate')}
              className={`text-xs py-1 px-3 rounded-full border cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                seriesFilter === 'corporate'
                  ? 'bg-sky-500 border-sky-500 text-black font-bold shadow-xs'
                  : 'bg-[#1b212b] border-sky-500/40 text-sky-300 hover:bg-[#1b212b]/80'
              }`}
            >
              <Briefcase className="w-3 h-3 text-sky-400" />
              <span>Corporate Challenges ({corporateRacesCount})</span>
            </button>
            <div className="w-full sm:w-auto mt-1 sm:mt-0">
              <select
                id="select-individual-series"
                value={RUNNING_SERIES_LIST.includes(seriesFilter as any) ? seriesFilter : ''}
                onChange={(e) => setSeriesFilter(e.target.value || 'all')}
                className="bg-[#1b212b] border border-[#2c333f] text-xs text-[#f5efe3] rounded-full px-3 py-1 focus:outline-none focus:border-[#d8b34a] cursor-pointer"
              >
                <option value="">Jump to specific series ({RUNNING_SERIES_LIST.length})...</option>
                {RUNNING_SERIES_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s} ({allRaces.filter((r) => r.series === s).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Clear Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-[#2c333f]/80 flex items-center justify-between text-xs">
            <span className="text-[#9aa1ac]">
              Active filter: Showing <b className="text-[#f5efe3]">{filteredRaces.length}</b> of{' '}
              {allRaces.length} races
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
              Try broadening your discipline, province, year, or search keyword filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold bg-[#242c38] text-[#f5efe3] hover:bg-[#2c333f] px-4 py-2 rounded-xs border border-[#2c333f] cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          filteredRaces.map((r) => {
            const { day, mon, year } = formatRaceDate(r.date);
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
                    {/* Date Badge with Month, Day, and Year */}
                    <div
                      id={`date-badge-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className="flex-none w-14 sm:w-16 py-1.5 px-1 flex flex-col items-center justify-center bg-[#12151b] border border-[#2c333f] rounded-xs text-center shadow-xs"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-[#d8b34a] font-bold block leading-none">
                        {mon}
                      </span>
                      <b className="font-display text-2xl sm:text-3xl leading-none text-[#f5efe3] block my-0.5">
                        {day}
                      </b>
                      <span className="text-[10px] font-mono text-[#9aa1ac] font-bold block leading-none">
                        {year}
                      </span>
                    </div>

                    {/* Race Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-[#f5efe3] leading-snug">
                          {r.name}
                        </h3>

                        {/* Status Badges */}
                        {r.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                        {r.status === 'postponed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                            <CalendarX className="w-3 h-3" />
                            Postponed
                          </span>
                        )}
                        {r.status === 'weather_delay' && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold">
                            <CloudRain className="w-3 h-3" />
                            Weather Delay
                          </span>
                        )}
                        {r.status === 'rescheduled' && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                            <RefreshCw className="w-3 h-3" />
                            Rescheduled
                          </span>
                        )}
                        {r.status === 'sold_out' && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                            <UserX className="w-3 h-3" />
                            Sold Out
                          </span>
                        )}

                        {renderDisciplineBadges(r)}
                        {r.series && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#d8b34a]/15 text-[#d8b34a] border border-[#d8b34a]/40 px-2 py-0.5 rounded-full font-bold">
                            <Award className="w-3 h-3 text-[#d8b34a]" />
                            {r.series}
                          </span>
                        )}
                        {r.isCorporate && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded-full font-bold">
                            <Briefcase className="w-3 h-3 text-sky-400" />
                            Corporate Series
                          </span>
                        )}
                        {r.isCommunity && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#d8b34a]/15 text-[#d8b34a] border border-[#d8b34a]/40 px-2 py-0.5 rounded-full font-bold">
                            <Sparkles className="w-3 h-3" />
                            {r.originalName ? 'Admin Updated' : 'Community Added'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm text-[#9aa1ac] flex items-center gap-2 flex-wrap mb-2">
                        <span>{r.city}</span>
                        <span>·</span>
                        <span className="font-bold text-[#d8b34a] bg-[#d8b34a]/10 border border-[#d8b34a]/30 px-1.5 py-0.2 rounded-xs text-[11px]">
                          {r.prov.toUpperCase()}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[#f5efe3] font-medium text-xs">
                          {day} {mon} {year}
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
                        {r.isCommunity && r.createdByName && (
                          <>
                            <span>·</span>
                            <span className="text-[#6d7580] text-[11px]">
                              Host: <span className="text-[#d8b34a]">{r.createdByName}</span>
                            </span>
                          </>
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

                      {/* Status Notice Banner if set */}
                      {r.status && r.status !== 'scheduled' && (
                        <div className="mt-2.5 p-2.5 rounded-lg bg-[#12151b] border border-[#2c333f] text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-[#e28b37] mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>
                              {r.status === 'cancelled' && 'Event Cancelled'}
                              {r.status === 'postponed' && 'Event Postponed'}
                              {r.status === 'weather_delay' && 'Weather Delay Advisory'}
                              {r.status === 'rescheduled' && 'Event Rescheduled'}
                              {r.status === 'sold_out' && 'Entries Sold Out'}
                            </span>
                          </div>
                          {r.statusNotice && (
                            <p className="text-[#9aa1ac] leading-relaxed mt-0.5">{r.statusNotice}</p>
                          )}
                          {r.newDate && (
                            <p className="mt-1 font-mono text-[11px] text-[#d8b34a]">
                              Rescheduled Target Date: <b>{r.newDate}</b>
                            </p>
                          )}
                        </div>
                      )}
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

                    {/* 5-Day Open-Meteo Weather Quick Trigger */}
                    <button
                      id={`weather-btn-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRaceTab((prev) => ({ ...prev, [key]: 'weather' }));
                        setExpandedRaceKey(key);
                      }}
                      title="5-day Open-Meteo atmospheric forecast for this race"
                      className="inline-flex items-center gap-1.5 bg-[#242c38] hover:bg-[#12161f] text-[#f5efe3] hover:text-[#d8b34a] border border-[#2c333f] hover:border-[#d8b34a]/50 px-2.5 py-1.5 rounded-xs text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <CloudSun className="w-3.5 h-3.5 text-[#d8b34a] group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline">Weather</span>
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

                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xs border transition-colors ${
                        isOpen
                          ? 'bg-[#e28b37] text-[#1b1103] border-[#e28b37] shadow-xs'
                          : 'bg-[#12151b] text-[#d8b34a] border-[#2c333f] hover:border-[#d8b34a] hover:bg-[#1a202c]'
                      }`}
                    >
                      <Mountain className={`w-3.5 h-3.5 ${isOpen ? 'text-[#1b1103]' : 'text-[#e28b37]'}`} />
                      <span>{isOpen ? 'Hide Details' : 'Elevation & Route'}</span>
                      {isOpen ? (
                        <ChevronUp className={`w-3.5 h-3.5 ${isOpen ? 'text-[#1b1103]' : 'text-[#e28b37]'}`} />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[#6d7580]" />
                      )}
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
                      raceDate={r.date}
                      idPrefix={`race-${r.name.replace(/\s+/g, '-').toLowerCase()}`}
                      initialViewMode={expandedRaceTab[key] || 'both'}
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
