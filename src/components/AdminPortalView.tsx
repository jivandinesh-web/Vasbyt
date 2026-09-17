import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Plus,
  Trash2,
  Search,
  Calendar,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Check,
  Pencil,
  CloudRain,
  CalendarX,
  UserX,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  StoredCommunityRace,
  transformCommunityRaceToRace,
  getRaceDeduplicationKey,
  pruneDuplicateCommunityRaces,
  mergeRacesWithOverrides,
  saveOrUpdateRace,
} from '../services/communityRaces';
import { RACES, formatRaceDate } from '../data/runningData';
import { CommunityRaceSubmission, Race } from '../types';
import { AddRaceModal } from './AddRaceModal';
import { EditRaceModal } from './EditRaceModal';

interface AdminPortalViewProps {
  communityRaces: StoredCommunityRace[];
  onAddRace: (submission: CommunityRaceSubmission) => Promise<void>;
  onUpdateRace?: (submission: CommunityRaceSubmission, originalRace: Race) => Promise<void>;
  onDeleteCommunityRace: (id: string) => Promise<void>;
  onNavigateTab: (tab: 'races' | 'home') => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  communityRaces,
  onAddRace,
  onUpdateRace,
  onDeleteCommunityRace,
  onNavigateTab,
}) => {
  const { user, isAdmin, openLoginModal, logout } = useAuth();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'custom' | 'official'>('all');
  const [provFilter, setProvFilter] = useState<string>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Modal & action states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRace, setEditingRace] = useState<Race | null>(null);
  const [isPruning, setIsPruning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fixtureToDelete, setFixtureToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Combine and deduplicate official and custom races for full admin view
  // Uses mergeRacesWithOverrides so that admin updates to any fixture take immediate effect
  const allRaces = useMemo(() => {
    return mergeRacesWithOverrides(communityRaces, RACES);
  }, [communityRaces]);

  const handleOpenEdit = (race: Race) => {
    setEditingRace(race);
  };

  const handleSaveRaceUpdate = async (submission: CommunityRaceSubmission, originalRace: Race) => {
    setStatusMessage(null);
    try {
      if (onUpdateRace) {
        await onUpdateRace(submission, originalRace);
      } else {
        await saveOrUpdateRace(submission, originalRace, user);
      }
      setStatusMessage({
        type: 'success',
        text: `Updated "${submission.name}". Status: ${submission.status ? submission.status.toUpperCase().replace('_', ' ') : 'SCHEDULED'}.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to save event modifications.',
      });
      throw err;
    }
  };

  // Extract all available calendar years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allRaces.forEach((r) => {
      const { year } = formatRaceDate(r.date);
      if (year && !isNaN(year)) years.add(year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [allRaces]);

  // Filtered fixtures
  const filteredFixtures = useMemo(() => {
    const list = allRaces.filter((race) => {
      // Source filter
      if (sourceFilter === 'custom' && !race.isCommunity) return false;
      if (sourceFilter === 'official' && race.isCommunity) return false;

      // Province filter
      if (provFilter !== 'all' && race.prov.toLowerCase() !== provFilter.toLowerCase()) return false;

      // Discipline filter
      if (disciplineFilter !== 'all') {
        const hasDisc =
          race.disciplines && race.disciplines.length > 0
            ? race.disciplines.includes(disciplineFilter as any)
            : race.discipline === disciplineFilter;
        if (!hasDisc) return false;
      }

      // Year filter
      if (yearFilter !== 'all') {
        const { year } = formatRaceDate(race.date);
        if (String(year) !== yearFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = race.name.toLowerCase().includes(q);
        const matchesCity = race.city.toLowerCase().includes(q);
        const matchesProv = race.prov.toLowerCase().includes(q);
        const matchesOrganiser = race.organiser?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesProv && !matchesOrganiser) return false;
      }

      return true;
    });

    // Sort chronologically by date
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [allRaces, sourceFilter, provFilter, disciplineFilter, yearFilter, searchQuery]);

  // Handle Pruning Duplicates
  const handlePruneDuplicates = async () => {
    if (!isAdmin) return;
    setIsPruning(true);
    setStatusMessage(null);
    try {
      const prunedCount = await pruneDuplicateCommunityRaces(communityRaces, user);
      if (prunedCount > 0) {
        setStatusMessage({
          type: 'success',
          text: `Successfully pruned ${prunedCount} duplicate fixture${prunedCount > 1 ? 's' : ''} from the database.`,
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Calendar is already fully optimized — no duplicate fixtures found.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Failed to prune duplicates: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setIsPruning(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  // Handle Single Fixture Deletion
  const confirmDelete = async () => {
    if (!fixtureToDelete) return;
    const { id, name } = fixtureToDelete;
    setDeletingId(id);
    try {
      await onDeleteCommunityRace(id);
      setStatusMessage({
        type: 'success',
        text: `Fixture "${name}" was permanently removed from the calendar.`,
      });
      setFixtureToDelete(null);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Could not delete fixture: ${err.message || 'Permission denied'}`,
      });
    } finally {
      setDeletingId(null);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Province options
  const provOptions = [
    { id: 'all', label: 'All Provinces' },
    { id: 'gp', label: 'Gauteng (GP)' },
    { id: 'wc', label: 'Western Cape (WC)' },
    { id: 'kzn', label: 'KwaZulu-Natal (KZN)' },
    { id: 'ec', label: 'Eastern Cape (EC)' },
    { id: 'fs', label: 'Free State (FS)' },
    { id: 'mp', label: 'Mpumalanga (MP)' },
    { id: 'lp', label: 'Limpopo (LP)' },
    { id: 'nw', label: 'North West (NW)' },
    { id: 'nc', label: 'Northern Cape (NC)' },
  ];

  // -------------------------------------------------------------
  // RESTRICTED ACCESS SCREEN (If user is not authenticated as admin)
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div id="admin-portal-restricted" className="py-12 sm:py-16 px-4 max-w-2xl mx-auto text-center">
        <div className="bg-[#171c24] border border-[#2c333f] rounded-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#d8b34a] to-amber-600" />

          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#f5efe3] mb-2">
            VAS<span className="text-[#e28b37]">BYT</span> Admin Portal
          </h1>

          <p className="text-sm font-semibold text-amber-300 mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <ShieldAlert className="w-4 h-4" />
            Restricted Fixture Management
          </p>

          <p className="text-xs sm:text-sm text-[#9aa1ac] leading-relaxed mb-6 max-w-md mx-auto">
            This portal is strictly reserved for authorized administrators (<span className="text-[#f5efe3] font-mono font-semibold">jivandinesh@gmail.com</span>) to curate, add, and delete race calendar fixtures across South Africa.
          </p>

          {user ? (
            <div className="mb-6 p-3.5 bg-[#12151b] border border-red-900/40 rounded-lg text-xs text-red-200 text-left">
              <p className="font-semibold text-red-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                Access Denied for Current Account
              </p>
              <p className="text-red-200/80">
                You are currently signed in as <strong className="text-white">{user.email}</strong>. This account does not possess calendar management credentials.
              </p>
              <button
                onClick={() => logout()}
                className="mt-2.5 text-xs font-semibold text-[#d8b34a] hover:underline cursor-pointer"
              >
                Sign out of this account
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <button
                id="admin-portal-login-btn"
                onClick={openLoginModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#d8b34a] hover:bg-[#e28b37] text-[#12151b] font-bold text-sm px-6 py-3 rounded-lg transition-all shadow-lg cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Sign In with Admin Account</span>
              </button>
            </div>
          )}

          <div className="pt-6 border-t border-[#2c333f]/70 flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigateTab('races')}
              className="inline-flex items-center gap-1.5 text-xs text-[#9aa1ac] hover:text-[#f5efe3] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Race Calendar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VERIFIED ADMINISTRATOR PORTAL
  // -------------------------------------------------------------
  const customFixturesCount = communityRaces.length;
  const officialFixturesCount = RACES.length;

  return (
    <div id="admin-portal-view" className="space-y-6 pb-12 text-left">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="admin-back-to-calendar-btn"
          onClick={() => onNavigateTab('races')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9aa1ac] hover:text-[#d8b34a] bg-[#171c24] hover:bg-[#202733] border border-[#2c333f] px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Race Calendar</span>
        </button>
        <span className="text-[11px] font-mono text-[#6d7580] hidden sm:inline">
          VASBYT Admin Console · Fixture Management
        </span>
      </div>

      {/* Top Banner & Title Bar */}
      <div className="bg-[#171c24] border border-[#2c333f] rounded-xl p-5 sm:p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d8b34a] via-[#e28b37] to-[#7c8f5c]" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-[#f5efe3]">
                VAS<span className="text-[#e28b37]">BYT</span> Admin Portal
              </h1>
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Admin: {user?.email}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9aa1ac]">
              Centralized fixture management console. Add new race fixtures, inspect calendar fixtures, and permanently delete outdated or duplicate entries.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="admin-add-fixture-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#d8b34a] hover:bg-[#e28b37] text-[#12151b] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Fixture</span>
            </button>

            <button
              id="admin-prune-duplicates-btn"
              onClick={handlePruneDuplicates}
              disabled={isPruning}
              title="Scan database and remove any duplicate fixtures"
              className="inline-flex items-center gap-2 bg-[#242c38] hover:bg-[#2c333f] text-[#f5efe3] border border-[#2c333f] font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPruning ? 'animate-spin text-[#d8b34a]' : 'text-[#9aa1ac]'}`} />
              <span>{isPruning ? 'Pruning...' : 'Prune Duplicates'}</span>
            </button>
          </div>
        </div>

        {/* Status Toast Alert */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-200'
                : 'bg-red-950/70 border-red-700/60 text-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Quick Stats Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#2c333f]/70">
          <div className="bg-[#12151b] border border-[#2c333f] rounded-lg p-3">
            <span className="block text-[10px] uppercase font-bold text-[#6d7580] tracking-wider">
              Total Active Fixtures
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#f5efe3]">
              {allRaces.length}
            </span>
          </div>
          <div className="bg-[#12151b] border border-[#2c333f] rounded-lg p-3">
            <span className="block text-[10px] uppercase font-bold text-[#d8b34a] tracking-wider">
              Custom / Added Fixtures
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#d8b34a]">
              {customFixturesCount}
            </span>
          </div>
          <div className="bg-[#12151b] border border-[#2c333f] rounded-lg p-3">
            <span className="block text-[10px] uppercase font-bold text-[#7c8f5c] tracking-wider">
              Official Major Races
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#7c8f5c]">
              {officialFixturesCount}
            </span>
          </div>
          <div className="bg-[#12151b] border border-[#2c333f] rounded-lg p-3">
            <span className="block text-[10px] uppercase font-bold text-[#6d7580] tracking-wider">
              Filtered Fixtures
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-[#f5efe3]">
              {filteredFixtures.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#171c24] border border-[#2c333f] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Source Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === 'all'
                ? 'bg-[#d8b34a] text-[#12151b]'
                : 'bg-[#12151b] text-[#9aa1ac] border border-[#2c333f] hover:text-[#f5efe3]'
            }`}
          >
            All Fixtures ({allRaces.length})
          </button>
          <button
            onClick={() => setSourceFilter('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === 'custom'
                ? 'bg-[#d8b34a] text-[#12151b]'
                : 'bg-[#12151b] text-[#9aa1ac] border border-[#2c333f] hover:text-[#f5efe3]'
            }`}
          >
            Custom Added ({customFixturesCount})
          </button>
          <button
            onClick={() => setSourceFilter('official')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              sourceFilter === 'official'
                ? 'bg-[#d8b34a] text-[#12151b]'
                : 'bg-[#12151b] text-[#9aa1ac] border border-[#2c333f] hover:text-[#f5efe3]'
            }`}
          >
            Official Major ({officialFixturesCount})
          </button>
        </div>

        {/* Dropdowns & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Province selector */}
          <select
            value={provFilter}
            onChange={(e) => setProvFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#d8b34a] cursor-pointer"
          >
            {provOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Discipline selector */}
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#d8b34a] cursor-pointer"
          >
            <option value="all">All Disciplines</option>
            <option value="road">Road Running</option>
            <option value="trail">Trail Running</option>
            <option value="walking">Walking</option>
            <option value="hiking">Hiking</option>
            <option value="trekking">Trekking</option>
            <option value="cycling">Cycling Tour</option>
          </select>

          {/* Calendar Year selector */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#d8b34a] cursor-pointer font-mono"
          >
            <option value="all">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={String(yr)}>
                {yr}
              </option>
            ))}
          </select>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6d7580]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search race, town, club…"
              className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#d8b34a]"
            />
          </div>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="space-y-3">
        {filteredFixtures.length === 0 ? (
          <div className="bg-[#171c24] border border-[#2c333f] rounded-xl p-12 text-center">
            <Calendar className="w-10 h-10 text-[#6d7580] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#f5efe3] mb-1">No fixtures match your filters</p>
            <p className="text-xs text-[#6d7580] mb-4">
              Try adjusting your province, discipline, or search query.
            </p>
            <button
              onClick={() => {
                setSourceFilter('all');
                setProvFilter('all');
                setDisciplineFilter('all');
                setYearFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold bg-[#242c38] text-[#f5efe3] px-3.5 py-1.5 rounded-lg border border-[#2c333f] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFixtures.map((race) => {
            const { day, mon, year } = formatRaceDate(race.date);
            const isDeleting = deletingId === race.id;
            const isCustom = race.isCommunity;
            const isExpanded = expandedId === (race.id || race.name);

            return (
              <div
                key={race.id || `${race.name}-${race.date}`}
                className="bg-[#171c24] border border-[#2c333f] rounded-xl p-4 transition-all hover:border-[#3d4554]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Date + Main Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Date Block with Year */}
                    <div className="w-14 py-1.5 bg-[#12151b] border border-[#2c333f] rounded-lg flex flex-col items-center justify-center shrink-0 text-center shadow-xs">
                      <span className="text-[10px] uppercase font-bold text-[#d8b34a] tracking-wider leading-none">
                        {mon}
                      </span>
                      <span className="text-xl font-black font-mono text-[#f5efe3] leading-tight my-0.5">
                        {day}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#9aa1ac] leading-none">
                        {year}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-display font-bold text-base sm:text-lg text-[#f5efe3]">
                          {race.name}
                        </h3>

                        {/* Event Status Badges */}
                        {race.status === 'cancelled' && (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                        {race.status === 'postponed' && (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                            <CalendarX className="w-3 h-3" />
                            Postponed
                          </span>
                        )}
                        {race.status === 'weather_delay' && (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 inline-flex items-center gap-1">
                            <CloudRain className="w-3 h-3" />
                            Weather Delay
                          </span>
                        )}
                        {race.status === 'rescheduled' && (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 inline-flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Rescheduled
                          </span>
                        )}
                        {race.status === 'sold_out' && (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 inline-flex items-center gap-1">
                            <UserX className="w-3 h-3" />
                            Sold Out
                          </span>
                        )}

                        {isCustom ? (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {race.originalName ? 'Edited Fixture' : 'Custom Fixture'}
                          </span>
                        ) : (
                          <span className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Official ASA Major
                          </span>
                        )}

                        {(race.disciplines && race.disciplines.length > 0 ? race.disciplines : [race.discipline]).map((disc) => (
                          <span key={disc} className="text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#242c38] text-[#9aa1ac] border border-[#2c333f]">
                            {disc}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#9aa1ac] flex-wrap">
                        <span className="flex items-center gap-1 text-[#f5efe3]">
                          <MapPin className="w-3.5 h-3.5 text-[#e28b37]" />
                          {race.city}, <strong className="uppercase">{race.prov}</strong>
                        </span>

                        <span className="text-[#2c333f]">•</span>

                        <span className="font-mono text-[#f5efe3] font-medium">
                          {day} {mon} {year}
                        </span>

                        <span className="text-[#2c333f]">•</span>

                        <span className="flex items-center gap-1 font-mono text-[#d8b34a]">
                          {race.dist.join(' / ')}
                        </span>

                        {race.organiser && (
                          <>
                            <span className="text-[#2c333f]">•</span>
                            <span className="text-[#6d7580]">Host: {race.organiser}</span>
                          </>
                        )}
                      </div>

                      {/* Status Notice Banner if set */}
                      {race.status && race.status !== 'scheduled' && race.statusNotice && (
                        <div className="mt-2.5 p-2.5 rounded-lg bg-[#12151b] border border-[#2c333f] text-xs flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#e28b37] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#e28b37]">
                              {race.status === 'cancelled' && 'Event Cancellation Notice'}
                              {race.status === 'postponed' && 'Event Postponement Notice'}
                              {race.status === 'weather_delay' && 'Weather Delay Advisory'}
                              {race.status === 'rescheduled' && 'Rescheduled Date Notice'}
                              {race.status === 'sold_out' && 'Entries Sold Out Notice'}
                            </div>
                            <div className="text-[#9aa1ac] mt-0.5 leading-relaxed">{race.statusNotice}</div>
                            {race.newDate && (
                              <div className="mt-1 text-[11px] text-[#d8b34a] font-mono">
                                Rescheduled Target Date: <b>{race.newDate}</b>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Edit, Delete & Inspect */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap sm:flex-nowrap">
                    {/* Edit Event Button */}
                    <button
                      id={`admin-edit-fixture-${race.id || race.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                      onClick={() => handleOpenEdit(race)}
                      title={`Edit event "${race.name}" (Status, date, name, details)`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#e28b37]/15 border border-[#e28b37]/40 text-[#e28b37] hover:bg-[#e28b37] hover:text-white transition-all cursor-pointer shadow-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Event</span>
                    </button>

                    {/* Toggle details preview */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : (race.id || race.name))}
                      className="px-2.5 py-1.5 text-xs text-[#9aa1ac] hover:text-[#f5efe3] bg-[#12151b] border border-[#2c333f] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete Action (Available for Custom Fixtures) */}
                    {isCustom && race.id && (
                      <button
                        id={`admin-delete-fixture-${race.id}`}
                        onClick={() => setFixtureToDelete({ id: race.id!, name: race.name })}
                        disabled={deletingId === race.id}
                        title={`Delete fixture "${race.name}" from calendar`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 hover:bg-red-900/60 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === race.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details Preview */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#2c333f] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[#12151b] p-2.5 rounded-lg border border-[#2c333f]">
                      <span className="block text-[10px] text-[#6d7580] uppercase font-bold">Course Type</span>
                      <span className="font-semibold text-[#f5efe3]">{race.route?.courseType || 'Loop'}</span>
                    </div>
                    <div className="bg-[#12151b] p-2.5 rounded-lg border border-[#2c333f]">
                      <span className="block text-[10px] text-[#6d7580] uppercase font-bold">Surface</span>
                      <span className="font-semibold text-[#f5efe3]">{race.route?.surface || 'Asphalt'}</span>
                    </div>
                    <div className="bg-[#12151b] p-2.5 rounded-lg border border-[#2c333f]">
                      <span className="block text-[10px] text-[#6d7580] uppercase font-bold">Cut-off Time</span>
                      <span className="font-semibold text-[#f5efe3]">{race.route?.cutoffTime || 'N/A'}</span>
                    </div>
                    <div className="bg-[#12151b] p-2.5 rounded-lg border border-[#2c333f]">
                      <span className="block text-[10px] text-[#6d7580] uppercase font-bold">Ascent / Descent</span>
                      <span className="font-semibold text-[#f5efe3]">
                        +{race.route?.totalAscentM || 0}m / -{race.route?.totalDescentM || 0}m
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Race Modal (Admin exclusive) */}
      <AddRaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (submission) => {
          await onAddRace(submission);
          setIsAddModalOpen(false);
          setStatusMessage({
            type: 'success',
            text: `Fixture "${submission.name}" successfully added to the live calendar!`,
          });
          setTimeout(() => setStatusMessage(null), 5000);
        }}
      />

      {/* Delete Confirmation Modal (Admin exclusive) */}
      {fixtureToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#171c24] border border-red-900/60 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-full bg-red-950/80 border border-red-800/50">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#f5efe3]">Delete Fixture</h3>
                <p className="text-[11px] text-[#9aa1ac]">Permanent removal from calendar</p>
              </div>
            </div>

            <p className="text-sm text-[#f5efe3]">
              Are you sure you want to permanently delete <strong className="text-[#e28b37]">"{fixtureToDelete.name}"</strong>?
            </p>

            <p className="text-xs text-red-300/90 bg-red-950/40 p-3 rounded-lg border border-red-900/40 leading-relaxed">
              This action cannot be undone. The fixture will be removed from the live South African calendar for all athletes immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFixtureToDelete(null)}
                disabled={deletingId !== null}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#12151b] border border-[#2c333f] text-[#9aa1ac] hover:text-[#f5efe3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Race Modal */}
      <EditRaceModal
        race={editingRace}
        isOpen={!!editingRace}
        onClose={() => setEditingRace(null)}
        onSave={handleSaveRaceUpdate}
      />
    </div>
  );
};
