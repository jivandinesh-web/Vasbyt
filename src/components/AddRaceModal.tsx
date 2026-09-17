import React, { useState } from 'react';
import { Discipline, DistanceCode, CommunityRaceSubmission } from '../types';
import { PROVINCES, RUNNING_SERIES_LIST } from '../data/runningData';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Plus,
  Calendar,
  MapPin,
  Activity,
  Mountain,
  Footprints,
  Trees,
  Tent,
  Clock,
  Droplets,
  Globe,
  Sparkles,
  CheckCircle,
  Check,
  Flag,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Award,
  Briefcase,
} from 'lucide-react';

interface AddRaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: CommunityRaceSubmission) => Promise<void>;
  defaultProv?: string;
  defaultDiscipline?: string;
}

const DISCIPLINE_OPTIONS: { id: Discipline; label: string; icon: any }[] = [
  { id: 'road', label: 'Road Running', icon: Activity },
  { id: 'trail', label: 'Trail Running', icon: Mountain },
  { id: 'cycling', label: 'Cycling Tour', icon: Compass },
  { id: 'track', label: 'Track & Field', icon: Flag },
  { id: 'walking', label: 'Walking', icon: Footprints },
  { id: 'hiking', label: 'Hiking', icon: Trees },
  { id: 'trekking', label: 'Trekking', icon: Tent },
];

const COMMON_DISTANCES: { code: DistanceCode; label: string; km: string }[] = [
  { code: 'F', label: 'Fun Run (5km)', km: '5km' },
  { code: 'T', label: '10km Classic', km: '10km' },
  { code: 'H', label: '21.1km Half', km: '21.1km' },
  { code: 'M', label: '42.2km Marathon', km: '42.2km' },
  { code: 'U', label: '50km+ Ultra', km: 'Ultra' },
  { code: 'CY', label: 'Cycling Tour', km: 'Cycling' },
  { code: 'TR', label: 'Trail Run', km: 'Trail' },
  { code: 'WK', label: 'Walk', km: 'Walk' },
  { code: 'HK', label: 'Hike', km: 'Hike' },
  { code: 'TK', label: 'Trek', km: 'Trek' },
];

const SA_CITIES_BY_PROV: Record<string, string[]> = {
  gp: ['Johannesburg', 'Pretoria', 'Soweto', 'Centurion', 'Benoni', 'Bedfordview', 'Krugersdorp', 'Midrand', 'Sandton'],
  wc: ['Cape Town', 'Stellenbosch', 'Paarl', 'Franschhoek', 'George', 'Knysna', 'Hermanus', 'Clanwilliam'],
  kzn: ['Durban', 'Pietermaritzburg', 'Ballito', 'Umhlanga', 'Underberg', 'Richards Bay', 'Drakensberg'],
  ec: ['Gqeberha', 'East London', 'Hogsback', 'Port Alfred', 'Jeffreys Bay', 'Makhanda', 'Chintsa'],
  fs: ['Bloemfontein', 'Clarens', 'Bethlehem', 'Welkom', 'Parys', 'Harrismith'],
  mp: ['Mbombela', 'Graskop', 'Sabie', 'Dullstroom', 'White River', 'Barberton'],
  lp: ['Polokwane', 'Mokopane', 'Haenertsburg', 'Tzaneen', 'Louis Trichardt', 'Bela-Bela'],
  nw: ['Rustenburg', 'Potchefstroom', 'Hartbeespoort', 'Klerksdorp', 'Sun City'],
  nc: ['Kimberley', 'Upington', 'Springbok', 'Sutherland', 'Colesberg'],
};

export const AddRaceModal: React.FC<AddRaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultProv = 'gp',
  defaultDiscipline = 'road',
}) => {
  const { user, isAdmin, openLoginModal } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [prov, setProv] = useState(defaultProv === 'all' ? 'gp' : defaultProv);
  const [city, setCity] = useState('');
  const [date, setDate] = useState(() => {
    // Default to upcoming Saturday in 2 weeks
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>(() => {
    if (defaultDiscipline && defaultDiscipline !== 'all') {
      return [defaultDiscipline as Discipline];
    }
    return ['road'];
  });
  const [selectedDistances, setSelectedDistances] = useState<DistanceCode[]>(['H', 'T']);
  const [organiser, setOrganiser] = useState('');
  const [site, setSite] = useState('');
  const [series, setSeries] = useState('');
  const [isCorporate, setIsCorporate] = useState(false);

  // Course Details (advanced section)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [courseType, setCourseType] = useState<'Loop' | 'Point-to-Point' | 'Out & Back' | 'Stage Run' | 'Stage Race'>('Loop');
  const [totalAscentM, setTotalAscentM] = useState<number | ''>(240);
  const [totalDescentM, setTotalDescentM] = useState<number | ''>(240);
  const [surface, setSurface] = useState<string>('Asphalt Road');
  const [cutoffTime, setCutoffTime] = useState<string>('04:30:00');
  const [waterTablesCount, setWaterTablesCount] = useState<number | ''>(5);
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDiscipline = (code: Discipline) => {
    setSelectedDisciplines((prev) => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev; // keep at least one discipline
        return prev.filter((d) => d !== code);
      }
      return [...prev, code];
    });
  };

  const toggleDistance = (code: DistanceCode) => {
    setSelectedDistances((prev) => {
      if (prev.includes(code)) {
        if (prev.length <= 1) return prev; // keep at least one
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Administrative permission check
    if (!isAdmin) {
      setErrorMsg('Administrator Access Required: Only authorized administrators (jivandinesh@gmail.com) can publish race fixtures to the calendar.');
      return;
    }

    // Form validations
    if (!name.trim()) {
      setErrorMsg('Please provide a race or event name.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please specify a host city or town.');
      return;
    }
    if (!date) {
      setErrorMsg('Please select a race date.');
      return;
    }
    if (selectedDistances.length === 0) {
      setErrorMsg('Please select at least one distance category.');
      return;
    }
    if (selectedDisciplines.length === 0) {
      setErrorMsg('Please select at least one discipline (e.g. Road, Trail, Walking).');
      return;
    }

    setIsSubmitting(true);
    try {
      const submission: CommunityRaceSubmission = {
        name: name.trim(),
        prov: prov.toLowerCase(),
        city: city.trim(),
        date,
        dist: selectedDistances,
        discipline: selectedDisciplines[0] || 'road',
        disciplines: selectedDisciplines,
        organiser: organiser.trim() || undefined,
        site: site.trim() || undefined,
        series: series.trim() || undefined,
        isCorporate: isCorporate || undefined,
        courseType,
        surface:
          surface ||
          (selectedDisciplines.includes('trail')
            ? 'Mountain Singletrack'
            : selectedDisciplines.includes('cycling')
            ? 'Tar & Gravel'
            : 'Asphalt Road'),
        totalAscentM: typeof totalAscentM === 'number' ? totalAscentM : 200,
        totalDescentM: typeof totalDescentM === 'number' ? totalDescentM : 200,
        cutoffTime: cutoffTime.trim() || '05:00:00',
        waterTablesCount: typeof waterTablesCount === 'number' ? waterTablesCount : 4,
        notes: notes.trim() || undefined,
      };

      await onSubmit(submission);
      setSuccessMsg('Race fixture added successfully!');
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Submit race error:', err);
      setErrorMsg(err?.message || 'Could not save race fixture. Please try again.');
      setIsSubmitting(false);
    }
  };

  const citySuggestions = SA_CITIES_BY_PROV[prov] || [];

  return (
    <div
      id="add-race-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="add-race-modal-card"
        className="relative w-full max-w-2xl bg-[#1a202c] border border-[#2c333f] rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c333f] bg-[#151922]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d8b34a]/15 text-[#d8b34a] flex items-center justify-center border border-[#d8b34a]/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f5efe3] tracking-wide">
                Submit a Race / Fixture
              </h2>
              <p className="text-xs text-[#9aa1ac]">
                Publish a running, trail, or cycling fixture to the South African calendar
              </p>
            </div>
          </div>
          <button
            id="close-add-race-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#242c38] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Status Banners */}
          {errorMsg && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <span className="font-semibold">Error:</span> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Administrative Authorization Notice */}
          {isAdmin ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-700/50 rounded-lg text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Admin Mode: Verified as <strong className="text-[#f5efe3]">{user?.email}</strong>. This fixture will be published live to the official South African calendar.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-lg text-xs flex items-start justify-between gap-3 text-amber-200">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 font-semibold mb-0.5">Administrator Access Required</strong>
                  <p className="text-amber-200/80 leading-relaxed text-[11px]">
                    Only administrators (<span className="font-mono text-amber-200">jivandinesh@gmail.com</span>) can add and publish race fixtures to the calendar.
                  </p>
                </div>
              </div>
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    openLoginModal();
                  }}
                  className="px-2.5 py-1 bg-[#d8b34a] hover:bg-[#e28b37] text-[#12151b] font-bold rounded text-xs transition-colors cursor-pointer shrink-0"
                >
                  Admin Sign In
                </button>
              )}
            </div>
          )}

          {/* Race Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
              Race / Event Name *
            </label>
            <input
              type="text"
              id="race-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stellenbosch Valley Trail Run or Randburg Harriers 21k"
              className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg px-3.5 py-2.5 text-sm text-[#f5efe3] placeholder-[#535c6a] outline-none transition-colors"
              required
            />
          </div>

          {/* Discipline Selector (Supports 2 or more disciplines) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac]">
                Disciplines * <span className="text-[11px] normal-case text-[#6e7787] font-normal">(Select 2 or more if applicable, e.g. Road + Walking)</span>
              </label>
              <span className="text-[11px] font-semibold text-[#d8b34a] bg-[#d8b34a]/10 px-2 py-0.5 rounded-full border border-[#d8b34a]/30">
                {selectedDisciplines.length} {selectedDisciplines.length === 1 ? 'discipline' : 'disciplines'} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DISCIPLINE_OPTIONS.map((disc) => {
                const Icon = disc.icon;
                const isSelected = selectedDisciplines.includes(disc.id);
                return (
                  <button
                    key={disc.id}
                    type="button"
                    onClick={() => toggleDiscipline(disc.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d8b34a]/15 border-[#d8b34a] text-[#f5efe3] shadow-xs ring-1 ring-[#d8b34a]/40'
                        : 'bg-[#12151b] border-[#2c333f] text-[#9aa1ac] hover:text-[#f5efe3] hover:border-[#3d4655]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#d8b34a]' : 'text-[#6e7787]'}`} />
                      <span className="truncate">{disc.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#d8b34a] flex-shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Province & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
                Province *
              </label>
              <select
                id="race-province-select"
                value={prov}
                onChange={(e) => setProv(e.target.value)}
                className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg px-3 py-2.5 text-sm text-[#f5efe3] outline-none transition-colors cursor-pointer"
              >
                {PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.ab})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
                Host City / Town *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="race-city-input"
                  list="sa-city-list"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Cape Town, Durban, Clarens"
                  className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#f5efe3] placeholder-[#535c6a] outline-none transition-colors"
                  required
                />
                <MapPin className="w-4 h-4 text-[#6e7787] absolute left-3 top-3" />
                <datalist id="sa-city-list">
                  {citySuggestions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Date & Distances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
                Race Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="race-date-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#f5efe3] outline-none transition-colors cursor-pointer"
                  required
                />
                <Calendar className="w-4 h-4 text-[#6e7787] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
                Cutoff Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  placeholder="e.g. 05:00:00"
                  className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#f5efe3] outline-none transition-colors"
                />
                <Clock className="w-4 h-4 text-[#6e7787] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Distance Chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
              Available Distances (Select all that apply) *
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_DISTANCES.map((d) => {
                const isSelected = selectedDistances.includes(d.code);
                return (
                  <button
                    key={d.code}
                    type="button"
                    onClick={() => toggleDistance(d.code)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d8b34a] text-[#12151b] border-[#d8b34a] shadow-sm'
                        : 'bg-[#12151b] border-[#2c333f] text-[#9aa1ac] hover:text-[#f5efe3]'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Organiser & Official Site */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
                Organiser / Host Club
              </label>
              <input
                type="text"
                value={organiser}
                onChange={(e) => setOrganiser(e.target.value)}
                placeholder="e.g. Rand Athletics Club or Cape Town City"
                className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg px-3 py-2.5 text-sm text-[#f5efe3] placeholder-[#535c6a] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9aa1ac] mb-1.5">
                Official Entry / Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="https://entryninja.com/..."
                  className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#f5efe3] placeholder-[#535c6a] outline-none transition-colors"
                />
                <Globe className="w-4 h-4 text-[#6e7787] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Running Series & Corporate Event Options */}
          <div className="p-3 bg-[#151922] border border-[#2c333f] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d8b34a] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Series &amp; Corporate Classification (Optional)
              </span>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#9aa1ac]">
                <input
                  type="checkbox"
                  checked={isCorporate}
                  onChange={(e) => setIsCorporate(e.target.checked)}
                  className="rounded border-[#2c333f] text-[#d8b34a] focus:ring-0 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-semibold text-[#f5efe3]">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  Corporate Event
                </span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] text-[#9aa1ac] mb-1 font-medium">
                Part of a Running Series? (Select or type custom series)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={RUNNING_SERIES_LIST.includes(series as any) ? series : ''}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg px-3 py-2 text-xs text-[#f5efe3] outline-none"
                >
                  <option value="">Select from Master 14 Series...</option>
                  {RUNNING_SERIES_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  placeholder="Or enter custom series name..."
                  className="w-full bg-[#12151b] border border-[#2c333f] focus:border-[#d8b34a] rounded-lg px-3 py-2 text-xs text-[#f5efe3] placeholder-[#535c6a] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Advanced Course & Elevation Section (Collapsible) */}
          <div className="border border-[#2c333f] rounded-lg overflow-hidden bg-[#151922]">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[#f5efe3] hover:bg-[#1f2633] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#d8b34a]" />
                <span>Course Profile, Elevation & Logistics (Optional)</span>
              </div>
              {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isAdvancedOpen && (
              <div className="p-4 border-t border-[#2c333f] space-y-4 bg-[#12151b]/60">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#9aa1ac] mb-1 font-medium">Course Format</label>
                    <select
                      value={courseType}
                      onChange={(e: any) => setCourseType(e.target.value)}
                      className="w-full bg-[#151922] border border-[#2c333f] rounded-lg p-2 text-xs text-[#f5efe3]"
                    >
                      <option value="Loop">Loop Course</option>
                      <option value="Out & Back">Out & Back</option>
                      <option value="Point-to-Point">Point-to-Point</option>
                      <option value="Stage Run">Stage Run</option>
                      <option value="Stage Race">Stage Race</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#9aa1ac] mb-1 font-medium">Total Ascent (m)</label>
                    <input
                      type="number"
                      value={totalAscentM}
                      onChange={(e) => setTotalAscentM(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 350"
                      className="w-full bg-[#151922] border border-[#2c333f] rounded-lg p-2 text-xs text-[#f5efe3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#9aa1ac] mb-1 font-medium">Water Stations</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={waterTablesCount}
                        onChange={(e) => setWaterTablesCount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 5"
                        className="w-full bg-[#151922] border border-[#2c333f] rounded-lg p-2 pl-7 text-xs text-[#f5efe3]"
                      />
                      <Droplets className="w-3.5 h-3.5 text-[#3b82f6] absolute left-2 top-2.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#9aa1ac] mb-1 font-medium">Surface Type</label>
                  <select
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    className="w-full bg-[#151922] border border-[#2c333f] rounded-lg p-2 text-xs text-[#f5efe3]"
                  >
                    <option value="Asphalt Road">Asphalt Road</option>
                    <option value="Mountain Singletrack">Mountain Singletrack</option>
                    <option value="Jeep Track & Trail">Jeep Track & Trail</option>
                    <option value="Paved Footpath & Promenade">Paved Footpath & Promenade</option>
                    <option value="Mountain Hiking Trail & Rocky Path">Mountain Rocky Path</option>
                    <option value="Track Oval">Track Oval</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#9aa1ac] mb-1 font-medium">Notes / Course Tips</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Water tables every 3km with Coke & potatoes. First 5km is flat before climb."
                    className="w-full bg-[#151922] border border-[#2c333f] rounded-lg p-2 text-xs text-[#f5efe3] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Automatic Features Notice */}
          <div className="p-3 bg-[#242c38]/40 border border-[#2c333f] rounded-lg flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#d8b34a]/10 text-[#d8b34a] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#9aa1ac] leading-relaxed">
              <strong>Auto-Enrichment</strong>: Once submitted, Vasbyt automatically generates an interactive elevation gradient chart, 5-day Open-Meteo weather forecasts, and watch sync files (FIT / GPX / Apple Workout).
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2c333f]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#242c38] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAdmin}
              id="submit-race-btn"
              title={isAdmin ? "Publish race fixture to calendar" : "Administrator permissions required"}
              className="inline-flex items-center gap-2 bg-[#d8b34a] hover:bg-[#e28b37] text-[#12151b] font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#12151b] border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : !isAdmin ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Admin Only</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish Fixture</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
