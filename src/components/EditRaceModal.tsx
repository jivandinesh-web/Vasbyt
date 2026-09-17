import React, { useState, useEffect } from 'react';
import {
  Discipline,
  DistanceCode,
  CommunityRaceSubmission,
  Race,
  RaceStatus,
} from '../types';
import { PROVINCES } from '../data/runningData';
import { useAuth } from '../context/AuthContext';
import {
  X,
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
  CheckCircle,
  Check,
  Flag,
  Compass,
  AlertTriangle,
  CloudRain,
  CalendarX,
  RefreshCw,
  UserX,
  Save,
  Pencil,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface EditRaceModalProps {
  race: Race | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CommunityRaceSubmission, originalRace: Race) => Promise<void>;
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

const STATUS_OPTIONS: {
  id: RaceStatus;
  label: string;
  badge: string;
  icon: any;
  colorClass: string;
  description: string;
}[] = [
  {
    id: 'scheduled',
    label: 'Confirmed / Scheduled',
    badge: 'Scheduled',
    icon: CheckCircle,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Event is proceeding as planned on official schedule',
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    badge: 'Cancelled',
    icon: AlertTriangle,
    colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    description: 'Event called off permanently or for this season',
  },
  {
    id: 'postponed',
    label: 'Postponed',
    badge: 'Postponed',
    icon: CalendarX,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Postponed to future date (pending or rescheduled)',
  },
  {
    id: 'weather_delay',
    label: 'Weather Delay',
    badge: 'Weather Delay',
    icon: CloudRain,
    colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    description: 'Delayed start / modified route due to rain, lightning or heat',
  },
  {
    id: 'rescheduled',
    label: 'Rescheduled',
    badge: 'Rescheduled',
    icon: RefreshCw,
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    description: 'New official date confirmed',
  },
  {
    id: 'sold_out',
    label: 'Sold Out',
    badge: 'Sold Out',
    icon: UserX,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    description: 'Race entries at capacity / registrations closed',
  },
];

const PRESET_NOTICES: Record<RaceStatus, string[]> = {
  scheduled: ['Event proceeding as scheduled. Route and registration active.'],
  cancelled: [
    'Event cancelled for this season by the organizing committee. Refund information will be emailed to entrants.',
    'Cancelled due to road permit denial by local municipality.',
    'Race cancelled due to unforeseen logistical constraints.',
  ],
  postponed: [
    'Event postponed due to severe weather and course flooding. New date will be announced soon.',
    'Postponed by race directors. All existing race entries will roll over to the new date.',
    'Postponed pending ASA / Provincial Athletics approval for alternate date.',
  ],
  weather_delay: [
    'Start delayed by 90 minutes due to severe electrical storm along the course. Check marshals on site.',
    'Weather delay: Wave starts pushed back by 1 hour due to heavy coastal mist / lightning advisory.',
    'Extreme heat protocol activated: Cutoffs adjusted and extra water points deployed.',
  ],
  rescheduled: [
    'Event has been rescheduled to a new date. See updated schedule details below.',
    'Rescheduled following council road closures. All registrations remain valid.',
  ],
  sold_out: [
    'Entries are officially SOLD OUT. No late entries or substitutions on race morning.',
    'Maximum field capacity reached. Entries closed.',
  ],
};

export const EditRaceModal: React.FC<EditRaceModalProps> = ({
  race,
  isOpen,
  onClose,
  onSave,
}) => {
  const { user, isAdmin } = useAuth();

  // Form states initialized from race
  const [name, setName] = useState('');
  const [status, setStatus] = useState<RaceStatus>('scheduled');
  const [statusNotice, setStatusNotice] = useState('');
  const [newDate, setNewDate] = useState('');
  const [date, setDate] = useState('');
  const [prov, setProv] = useState('gp');
  const [city, setCity] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>(['road']);
  const [selectedDistances, setSelectedDistances] = useState<DistanceCode[]>(['H']);
  const [organiser, setOrganiser] = useState('');
  const [site, setSite] = useState('');

  // Course Details (advanced section)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [courseType, setCourseType] = useState<'Loop' | 'Point-to-Point' | 'Out & Back' | 'Stage Run' | 'Stage Race'>('Loop');
  const [totalAscentM, setTotalAscentM] = useState<number | ''>(200);
  const [totalDescentM, setTotalDescentM] = useState<number | ''>(200);
  const [surface, setSurface] = useState<string>('Asphalt Road');
  const [cutoffTime, setCutoffTime] = useState<string>('06:00:00');
  const [waterTablesCount, setWaterTablesCount] = useState<number | ''>(4);
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when race prop changes or modal opens
  useEffect(() => {
    if (race && isOpen) {
      setName(race.name || '');
      setStatus(race.status || 'scheduled');
      setStatusNotice(race.statusNotice || '');
      setNewDate(race.newDate || '');
      setDate(race.date || '');
      setProv(race.prov ? race.prov.toLowerCase() : 'gp');
      setCity(race.city || '');
      const initialDisciplines: Discipline[] =
        race.disciplines && race.disciplines.length > 0
          ? race.disciplines
          : race.discipline
          ? [race.discipline]
          : ['road'];
      setSelectedDisciplines(initialDisciplines);
      setSelectedDistances(race.dist && race.dist.length > 0 ? race.dist : ['H']);
      setOrganiser(race.organiser || '');
      setSite(race.site || '');

      // Route profile attributes
      if (race.route) {
        setCourseType(race.route.courseType || 'Loop');
        setTotalAscentM(typeof race.route.totalAscentM === 'number' ? race.route.totalAscentM : '');
        setTotalDescentM(typeof race.route.totalDescentM === 'number' ? race.route.totalDescentM : '');
        setSurface(race.route.surface || 'Asphalt Road');
        setCutoffTime(race.route.cutoffTime || '06:00:00');
        setWaterTablesCount(typeof race.route.waterTablesCount === 'number' ? race.route.waterTablesCount : '');
        setNotes(race.route.note || '');
      }
      setErrorMsg(null);
    }
  }, [race, isOpen]);

  if (!isOpen || !race) return null;

  const toggleDiscipline = (code: Discipline) => {
    if (selectedDisciplines.includes(code)) {
      if (selectedDisciplines.length > 1) {
        setSelectedDisciplines(selectedDisciplines.filter((d) => d !== code));
      }
    } else {
      setSelectedDisciplines([...selectedDisciplines, code]);
    }
  };

  const toggleDistance = (code: DistanceCode) => {
    if (selectedDistances.includes(code)) {
      if (selectedDistances.length > 1) {
        setSelectedDistances(selectedDistances.filter((d) => d !== code));
      }
    } else {
      setSelectedDistances([...selectedDistances, code]);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setStatusNotice(preset);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isAdmin) {
      setErrorMsg('Unauthorized: Only administrators (jivandinesh@gmail.com) can update fixtures.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Event Name is required.');
      return;
    }

    if (!city.trim()) {
      setErrorMsg('City / Location is required.');
      return;
    }

    if (!date) {
      setErrorMsg('Event Date is required.');
      return;
    }

    if (selectedDistances.length === 0) {
      setErrorMsg('Select at least one distance option.');
      return;
    }

    if (selectedDisciplines.length === 0) {
      setErrorMsg('Select at least one discipline category.');
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
        totalAscentM: typeof totalAscentM === 'number' ? totalAscentM : undefined,
        totalDescentM: typeof totalDescentM === 'number' ? totalDescentM : undefined,
        courseType,
        surface: surface.trim() || undefined,
        cutoffTime: cutoffTime.trim() || undefined,
        waterTablesCount: typeof waterTablesCount === 'number' ? waterTablesCount : undefined,
        notes: notes.trim() || undefined,
        status,
        statusNotice: statusNotice.trim() || undefined,
        newDate: (status === 'postponed' || status === 'rescheduled') && newDate ? newDate : undefined,
      };

      await onSave(submission, race);
      onClose();
    } catch (err: any) {
      console.error('Error saving race updates:', err);
      setErrorMsg(err.message || 'Failed to save updates. Please check connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNonScheduled = status !== 'scheduled';
  const presetsForStatus = PRESET_NOTICES[status] || [];

  return (
    <div
      id="edit-race-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="edit-race-modal-container"
        className="relative w-full max-w-2xl bg-[#171c24] border border-[#2c333f] rounded-xs shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2c333f] flex items-center justify-between bg-[#12151b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#e28b37]/15 border border-[#e28b37]/30 flex items-center justify-center text-[#e28b37] shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#f5efe3] leading-tight">
                  Edit Event / Fixture
                </h2>
                {race.isCommunity ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#7c8f5c]/20 text-[#7c8f5c] border border-[#7c8f5c]/40 px-2 py-0.5 rounded-xs">
                    Custom Added
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#d8b34a]/20 text-[#d8b34a] border border-[#d8b34a]/40 px-2 py-0.5 rounded-xs">
                    Official Fixture
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9aa1ac]">
                Update details, name, calendar date, or report cancellation / delay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xs flex items-center justify-center text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#242c38] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Admin Verification Notice */}
          <div className="bg-[#12151b] border border-[#2c333f] rounded-xs p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#9aa1ac]">
              <ShieldCheck className="w-4 h-4 text-[#7c8f5c] shrink-0" />
              <span>
                Signed in as <b className="text-[#f5efe3]">{user?.email || 'Administrator'}</b>
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7c8f5c] bg-[#7c8f5c]/10 border border-[#7c8f5c]/30 px-2 py-0.5 rounded-xs">
              Live Sync Active
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xs text-xs text-rose-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Event Status (Cancelled, Postponed, Weather Delay, etc.) */}
          <div className="space-y-3 bg-[#12151b] p-3.5 sm:p-4 rounded-xs border border-[#2c333f]">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider font-bold text-[#f5efe3] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#e28b37]" />
                Event Status &amp; Announcements
              </label>
              <span className="text-[10px] text-[#6d7580]">Real-time public calendar badge</span>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setStatus(opt.id);
                      if (opt.id !== 'scheduled' && !statusNotice) {
                        setStatusNotice(PRESET_NOTICES[opt.id][0] || '');
                      }
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                      isSelected
                        ? opt.colorClass + ' ring-1 ring-inset shadow-xs font-bold'
                        : 'bg-[#171c24] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs truncate">{opt.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Status Alert Detail Area (Expands when non-scheduled) */}
            {isNonScheduled && (
              <div className="mt-3 pt-3 border-t border-[#2c333f] space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#f5efe3] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#e28b37]" />
                      Status Notice / Reason for Participants
                    </label>
                    <span className="text-[10px] text-[#9aa1ac]">Displays on race card</span>
                  </div>
                  <textarea
                    rows={2}
                    value={statusNotice}
                    onChange={(e) => setStatusNotice(e.target.value)}
                    placeholder="e.g. Postponed due to flash flooding along course; start delayed 2 hours due to electrical storm..."
                    className="w-full bg-[#171c24] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs p-2.5 focus:outline-none focus:border-[#e28b37]"
                  />
                </div>

                {/* Quick Presets */}
                {presetsForStatus.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6d7580] block mb-1.5">
                      Quick Preset Messages:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {presetsForStatus.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="text-left text-[11px] text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#1f2632] px-2.5 py-1.5 rounded-xs border border-[#2c333f]/70 transition-colors cursor-pointer"
                        >
                          "{preset}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Date if Postponed or Rescheduled */}
                {(status === 'postponed' || status === 'rescheduled') && (
                  <div className="pt-2 border-t border-[#2c333f]/60">
                    <label className="text-xs font-semibold text-[#f5efe3] flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#e28b37]" />
                      Rescheduled Date (if confirmed)
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full sm:w-64 bg-[#171c24] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#e28b37]"
                    />
                    <p className="text-[10px] text-[#6d7580] mt-1">
                      Leave blank if the new date is still to be determined (TBD).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Core Event Details (Name, Date, Location) */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#6d7580] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#e28b37]" />
              Event Particulars
            </h3>

            {/* Event Name */}
            <div>
              <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                Race / Event Name <span className="text-[#e28b37]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cape Town Marathon, SkyRun 100..."
                className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3.5 py-2.5 focus:outline-none focus:border-[#e28b37] font-semibold"
                required
              />
            </div>

            {/* Date and Province Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                  Event Date <span className="text-[#e28b37]">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#e28b37]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                  Province <span className="text-[#e28b37]">*</span>
                </label>
                <select
                  value={prov}
                  onChange={(e) => {
                    const newProv = e.target.value;
                    setProv(newProv);
                    const suggestedCities = SA_CITIES_BY_PROV[newProv];
                    if (suggestedCities && suggestedCities.length > 0) {
                      setCity(suggestedCities[0]);
                    }
                  }}
                  className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#e28b37] cursor-pointer uppercase font-mono"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.ab})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Disciplines Multi-select (Supports 2 or more disciplines) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#f5efe3]">
                  Disciplines <span className="text-[#e28b37]">*</span> <span className="text-[11px] font-normal text-[#9aa1ac]">(Select 2 or more if applicable, e.g. Road + Walking)</span>
                </label>
                <span className="text-[10px] font-semibold text-[#e28b37] bg-[#e28b37]/10 px-2 py-0.5 rounded-full border border-[#e28b37]/30">
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
                      className={`flex items-center justify-between p-2 rounded-xs border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#e28b37]/15 border-[#e28b37] text-[#f5efe3] shadow-xs ring-1 ring-[#e28b37]/30'
                          : 'bg-[#12151b] border-[#2c333f] text-[#9aa1ac] hover:text-[#f5efe3] hover:border-[#3d4655]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#e28b37]' : 'text-[#6e7787]'}`} />
                        <span className="truncate">{disc.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#e28b37] flex-shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City / Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#f5efe3]">
                  Host City / Town / Venue <span className="text-[#e28b37]">*</span>
                </label>
                <span className="text-[10px] text-[#6d7580]">
                  Suggestions: {SA_CITIES_BY_PROV[prov]?.slice(0, 4).join(', ')}
                </span>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Stellenbosch, Nature's Valley, Soweto"
                className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3.5 py-2.5 focus:outline-none focus:border-[#e28b37]"
                required
              />
            </div>

            {/* Distances Multi-select */}
            <div>
              <label className="text-xs font-semibold text-[#f5efe3] block mb-1.5">
                Race Distances <span className="text-[#e28b37]">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_DISTANCES.map((d) => {
                  const isSelected = selectedDistances.includes(d.code);
                  return (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => toggleDistance(d.code)}
                      className={`text-xs py-1.5 px-3 rounded-full border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#e28b37] border-[#e28b37] text-white font-bold shadow-xs'
                          : 'bg-[#12151b] border-[#2c333f] text-[#9aa1ac] hover:border-[#6d7580] hover:text-[#f5efe3]'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Organiser & Official Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                  Organizing Club / Company
                </label>
                <input
                  type="text"
                  value={organiser}
                  onChange={(e) => setOrganiser(e.target.value)}
                  placeholder="e.g. Comrades Marathon Association"
                  className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#e28b37]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                  Official Website / Registration URL
                </label>
                <input
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="e.g. https://www.entryninja.com/events/..."
                  className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#e28b37]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Course Profile, Cutoffs & Elevation (Advanced Collapsible) */}
          <div className="border border-[#2c333f] rounded-xs bg-[#12151b] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#171c24] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#d8b34a]" />
                <span className="text-xs font-bold text-[#f5efe3] uppercase tracking-wider">
                  Course Profile, Elevation &amp; Water Points
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9aa1ac]">
                <span>{isAdvancedOpen ? 'Collapse' : 'Expand'}</span>
                {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isAdvancedOpen && (
              <div className="p-4 border-t border-[#2c333f] space-y-3 bg-[#171c24]/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Course Structure
                    </label>
                    <select
                      value={courseType}
                      onChange={(e: any) => setCourseType(e.target.value)}
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a] cursor-pointer"
                    >
                      <option value="Loop">Loop (Starts & Ends at same venue)</option>
                      <option value="Point-to-Point">Point-to-Point (Comrades / Two Oceans)</option>
                      <option value="Out & Back">Out &amp; Back</option>
                      <option value="Stage Run">Stage Run (Multi-Day)</option>
                      <option value="Stage Race">Stage Race</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Running Surface
                    </label>
                    <input
                      type="text"
                      value={surface}
                      onChange={(e) => setSurface(e.target.value)}
                      placeholder="e.g. Asphalt Road, Mountain Singletrack"
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Ascent Gain (+m)
                    </label>
                    <input
                      type="number"
                      value={totalAscentM}
                      onChange={(e) => setTotalAscentM(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 450"
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Descent Loss (-m)
                    </label>
                    <input
                      type="number"
                      value={totalDescentM}
                      onChange={(e) => setTotalDescentM(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 450"
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Official Cutoff
                    </label>
                    <input
                      type="text"
                      value={cutoffTime}
                      onChange={(e) => setCutoffTime(e.target.value)}
                      placeholder="06:00:00"
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Water Tables / Hydration Stations
                    </label>
                    <input
                      type="number"
                      value={waterTablesCount}
                      onChange={(e) => setWaterTablesCount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 5"
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#f5efe3] block mb-1">
                      Course Notes / Route Briefing
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Key course details, water points, bag drop info..."
                      className="w-full bg-[#12151b] border border-[#2c333f] text-[#f5efe3] text-xs rounded-xs px-3 py-2 focus:outline-none focus:border-[#d8b34a]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-[#2c333f] flex items-center justify-between gap-3 bg-[#171c24]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xs text-xs font-semibold text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#242c38] border border-transparent transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xs text-xs font-bold text-white bg-[#e28b37] hover:bg-[#c97426] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Updates...' : 'Save Event Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
