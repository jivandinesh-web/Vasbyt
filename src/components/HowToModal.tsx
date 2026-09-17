import React, { useState } from 'react';
import {
  BookOpen,
  X,
  MapPin,
  Calendar,
  Users,
  User,
  Star,
  Layers,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Clock,
  Flame,
  Award,
  Briefcase,
  Watch,
  Mountain,
  PlusCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { TabType } from '../types';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

type SectionKey =
  | 'overview'
  | 'countdown'
  | 'series'
  | 'races'
  | 'watch_sync'
  | 'maps'
  | 'community'
  | 'provinces_clubs'
  | 'passport';

interface GuideSection {
  id: SectionKey;
  title: string;
  badge?: string;
  icon: React.ReactNode;
}

export const HowToModal: React.FC<HowToModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');

  if (!isOpen) return null;

  const sections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'countdown',
      title: 'Race Countdown & Taper',
      badge: 'Live Clock',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'series',
      title: '14 Running Series & Corporate',
      badge: '14 Series',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'races',
      title: 'Race Calendar & Seeding',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'watch_sync',
      title: 'GPS Watch Route Sync',
      badge: 'GPX / FIT',
      icon: <Watch className="w-4 h-4" />,
    },
    {
      id: 'maps',
      title: 'Interactive Elevation & Maps',
      icon: <Mountain className="w-4 h-4" />,
    },
    {
      id: 'community',
      title: 'Submit Races & Community',
      badge: 'Cloud Sync',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'provinces_clubs',
      title: '9 Provinces, Weather & Clubs',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'passport',
      title: 'Runner Passport & ASA License',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <div
      id="modal-howto-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-howto-card"
        className="bg-[#171c24] border border-[#2c333f] w-full max-w-4xl max-h-[90vh] rounded-xs shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#2c333f] bg-[#12151b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#d8b34a]/15 border border-[#d8b34a]/35 flex items-center justify-center text-[#d8b34a]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl tracking-wide uppercase text-[#f5efe3] leading-none">
                  How Vasbyt Works
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e28b37]/20 text-[#e28b37] border border-[#e28b37]/40 hidden sm:inline-block">
                  Platform Guide
                </span>
              </div>
              <p className="text-xs text-[#9aa1ac] mt-1">
                Your complete guide to South African road, trail, track, and corporate endurance racing.
              </p>
            </div>
          </div>
          <button
            id="btn-close-howto"
            onClick={onClose}
            className="text-[#9aa1ac] hover:text-[#f5efe3] p-1.5 rounded-xs hover:bg-[#242c38] transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Section Navigation Sidebar */}
          <div className="w-full md:w-64 bg-[#141820] border-b md:border-b-0 md:border-r border-[#2c333f] p-2 sm:p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`howto-nav-${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xs text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#242c38] text-[#d8b34a] border border-[#d8b34a]/40 shadow-xs'
                      : 'text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#1b212b] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#d8b34a]' : 'text-[#6d7580]'}>
                      {sec.icon}
                    </span>
                    <span>{sec.title}</span>
                  </div>
                  {sec.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full hidden lg:inline-block ${
                        isActive
                          ? 'bg-[#d8b34a]/20 text-[#d8b34a]'
                          : 'bg-[#242c38] text-[#6d7580]'
                      }`}
                    >
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Section Reader */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-[#cfd4dc] text-sm leading-relaxed">
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d8b34a]" />
                    Welcome to Vasbyt South Africa
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1.5">
                    <strong>&ldquo;Vasbyt&rdquo;</strong> is the quintessential South African runner&apos;s ethos: hang in there, endure the tough kilometers, and finish strong. Vasbyt brings together all official ASA road marathons, trail fixtures, track meets, and corporate running series into a unified endurance platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#12151b] border border-[#2c333f] p-3 rounded-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d8b34a]">
                      <Clock className="w-3.5 h-3.5 text-[#d8b34a]" />
                      1. Live Target Countdown
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      Star any fixture to launch real-time countdown clocks, SAST gun-time alerts, and 5-stage training phase guidance.
                    </p>
                  </div>

                  <div className="bg-[#12151b] border border-[#2c333f] p-3 rounded-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e28b37]">
                      <Award className="w-3.5 h-3.5 text-[#e28b37]" />
                      2. 14 Signature Series
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      Track corporate challenges (JPMorganChase, Barron Run4Good) and marquee national series (Absa RUN YOUR CITY, Vitality, SPAR).
                    </p>
                  </div>

                  <div className="bg-[#12151b] border border-[#2c333f] p-3 rounded-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                      <Watch className="w-3.5 h-3.5 text-sky-400" />
                      3. GPS Watch Route Sync
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      One-click GPX export for Garmin, Apple Watch, Suunto, and Coros with elevation gain and aid station waypoints.
                    </p>
                  </div>

                  <div className="bg-[#12151b] border border-[#2c333f] p-3 rounded-xs space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7c8f5c]">
                      <Mountain className="w-3.5 h-3.5 text-[#7c8f5c]" />
                      4. SVG Elevation Scrubber
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      Scrub across course profiles to see exact kilometer marks, altitude, gradient slopes, and cut-off checkpoints.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('home');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d8b34a] text-[#12151b] hover:bg-[#e28b37] text-xs font-bold rounded-xs cursor-pointer transition-colors"
                  >
                    View Home Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('races');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#242c38] text-[#f5efe3] hover:bg-[#2c3645] border border-[#3d4756] text-xs font-semibold rounded-xs cursor-pointer transition-colors"
                  >
                    Open Race Calendar
                  </button>
                </div>
              </div>
            )}

            {/* COUNTDOWN & TRAINING PHASES */}
            {activeSection === 'countdown' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d8b34a]" />
                  Live Race Countdown &amp; Training Phases
                </h3>
                <p className="text-xs text-[#9aa1ac]">
                  Vasbyt puts your primary target races front and center on the dashboard with a high-contrast digital ticker and physiological training periodization guidance.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">1-Click Star (★) to Target:</strong> Star any race in the calendar or on provincial pages. It immediately becomes an active countdown target on your Home dashboard.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Real-Time SAST Gun Clock:</strong> Ticks down Days, Hours, Minutes, and Seconds to 06:00 AM South African Standard Time on race morning.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Adaptive Training Phases:</strong> Based on the days remaining, Vasbyt highlights your current phase:
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="p-2 bg-[#12151b] border border-[#2c333f] rounded-xs text-[11px]">
                          <span className="text-emerald-400 font-bold block">Base Volume (&gt;60 days)</span>
                          Aerobic base miles &amp; gradual long run buildup.
                        </div>
                        <div className="p-2 bg-[#12151b] border border-[#2c333f] rounded-xs text-[11px]">
                          <span className="text-amber-400 font-bold block">Peak Mileage (21–60 days)</span>
                          Simulation tempos, marathon pace &amp; key fuel tests.
                        </div>
                        <div className="p-2 bg-[#12151b] border border-[#2c333f] rounded-xs text-[11px]">
                          <span className="text-[#d8b34a] font-bold block">Taper Phase (8–21 days)</span>
                          Volume cuts of 20–30%, sharp strides, glycogen loading.
                        </div>
                        <div className="p-2 bg-[#12151b] border border-[#2c333f] rounded-xs text-[11px]">
                          <span className="text-[#e28b37] font-bold block">Race Week (1–7 days)</span>
                          Carb-loading, sleep hygiene, bib &amp; kit layout.
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Multi-Target Switching:</strong> If you bookmark multiple fixtures (e.g. a tune-up 21km and Comrades Marathon), toggle between them with one click on the dashboard.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Add to iCal / Google Calendar:</strong> Click &ldquo;Add to Calendar&rdquo; to download an official <code>.ics</code> invite prefilled with start time, venue, and course summary.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('home');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d8b34a] text-[#12151b] text-xs font-bold rounded-xs cursor-pointer"
                >
                  View Countdown on Home
                </button>
              </div>
            )}

            {/* 14 RUNNING SERIES & CORPORATE */}
            {activeSection === 'series' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#d8b34a]" />
                  14 Signature Series &amp; Corporate Challenges
                </h3>
                <p className="text-xs text-[#9aa1ac]">
                  South Africa boasts world-renowned corporate challenges and high-energy mass-participation series. Vasbyt integrates all 14 official series within their authentic disciplines (road and trail).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-300">
                      <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                      JPMorganChase Corporate Challenge
                    </div>
                    <p className="text-[11px] text-[#9aa1ac]">5.6km team road run at Wanderers Club, Johannesburg for corporate camaraderie.</p>
                  </div>

                  <div className="p-2.5 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-300">
                      <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                      Barron Corporate Run4Good
                    </div>
                    <p className="text-[11px] text-[#9aa1ac]">5km &amp; 10km charity challenge at SuperSport Park, Centurion.</p>
                  </div>

                  <div className="p-2.5 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#d8b34a]">
                      <Award className="w-3.5 h-3.5 text-[#d8b34a]" />
                      Absa RUN YOUR CITY Series
                    </div>
                    <p className="text-[11px] text-[#9aa1ac]">Flat, fast 10K road series in Cape Town, Durban, and Tshwane.</p>
                  </div>

                  <div className="p-2.5 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#d8b34a]">
                      <Award className="w-3.5 h-3.5 text-[#d8b34a]" />
                      Discovery Vitality Run Series
                    </div>
                    <p className="text-[11px] text-[#9aa1ac]">Old Eds, Wanderers, Randburg, and Rockies road challenges with Vitality points.</p>
                  </div>

                  <div className="p-2.5 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#d8b34a]">
                      <Award className="w-3.5 h-3.5 text-[#d8b34a]" />
                      SPAR Women&apos;s Challenge
                    </div>
                    <p className="text-[11px] text-[#9aa1ac]">Massive 10km Grand Prix &amp; 5km fun runs across 6 metropolitan cities.</p>
                  </div>

                  <div className="p-2.5 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#d8b34a]">
                      <Award className="w-3.5 h-3.5 text-[#d8b34a]" />
                      parkrun South Africa
                    </div>
                    <p className="text-[11px] text-[#9aa1ac]">Free weekly timed 5km events across 200+ venues nationwide every Saturday.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs text-xs space-y-1">
                  <span className="font-bold text-[#f5efe3] block">How to Filter by Series:</span>
                  <p className="text-[#9aa1ac]">
                    Open the <strong>Race Calendar</strong> and use the <em>&ldquo;14 Running Series&rdquo;</em> filter pill or the <em>&ldquo;Corporate Challenges&rdquo;</em> chip to view dates, host venues, and entry links for your corporate division or favorite series.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('races');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d8b34a] text-[#12151b] text-xs font-bold rounded-xs cursor-pointer"
                >
                  Explore Running Series in Calendar
                </button>
              </div>
            )}

            {/* RACE CALENDAR & QUALIFIERS */}
            {activeSection === 'races' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d8b34a]" />
                  Race Calendar, Qualifiers &amp; Cut-Offs
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Comrades &amp; Two Oceans Qualifiers:</strong> Look for the gold <em>&ldquo;Comrades Qualifier&rdquo;</em> tag on marathon and ultra events to confirm official ASA qualifying status (sub-4h49 standard).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Distance Code Filtering:</strong> Toggle <em>10km (T)</em>, <em>Half Marathon 21.1k (H)</em>, <em>Full Marathon 42.2k (M)</em>, or <em>Ultra 50k+ (U)</em> to plan your racing calendar.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Live Search &amp; Province Filtering:</strong> Filter instantly by city name, organiser, province (e.g. <em>CGA, WPA, KZNA, AGN</em>), or calendar year.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Registration &amp; Timing Links:</strong> Access direct links to official race portals (ChampionChip, RaceTec, FinishTime, EntryNinja) and route maps.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('races');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e28b37] text-[#1b1103] text-xs font-bold rounded-xs cursor-pointer"
                >
                  Open Race Calendar
                </button>
              </div>
            )}

            {/* GPS WATCH SYNC */}
            {activeSection === 'watch_sync' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Watch className="w-4 h-4 text-[#e28b37]" />
                  GPS Watch Route Sync Engine
                </h3>
                <p className="text-xs text-[#9aa1ac]">
                  Vasbyt allows runners to export course route tracks directly to modern GPS smartwatches for turn-by-turn pacing, elevation guidance, and aid-station alerts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#f5efe3]">
                      <Watch className="w-3.5 h-3.5 text-sky-400" />
                      Garmin (Forerunner / Fenix)
                    </div>
                    <p className="text-[#9aa1ac] text-[11px]">
                      Download the GPX or FIT file and import into <strong>Garmin Connect &gt; Training &amp; Planning &gt; Courses</strong>, or drag directly into your watch&apos;s <code>GARMIN/NewFiles</code> folder via USB.
                    </p>
                  </div>

                  <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#f5efe3]">
                      <Watch className="w-3.5 h-3.5 text-rose-400" />
                      Apple Watch (Ultra / Series)
                    </div>
                    <p className="text-[#9aa1ac] text-[11px]">
                      Share the GPX track to the <strong>WorkOutDoors</strong> app or Apple Health routes on your iPhone to navigate courses with offline vector topo maps on your wrist.
                    </p>
                  </div>

                  <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#f5efe3]">
                      <Watch className="w-3.5 h-3.5 text-amber-400" />
                      Coros (Pace / Apex / Vertix)
                    </div>
                    <p className="text-[#9aa1ac] text-[11px]">
                      Open the GPX in the <strong>Coros App &gt; Profile &gt; Navigation Routes Library</strong>, then tap &ldquo;Sync with Watch&rdquo;.
                    </p>
                  </div>

                  <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#f5efe3]">
                      <Watch className="w-3.5 h-3.5 text-emerald-400" />
                      Suunto (Race / Vertical / 9 Peak)
                    </div>
                    <p className="text-[#9aa1ac] text-[11px]">
                      Import GPX into the <strong>Suunto App &gt; Route Planner</strong> and toggle &ldquo;Use in Watch&rdquo; for climb guidance.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs text-xs">
                  <span className="font-bold text-[#d8b34a] block mb-1">How to Launch Watch Sync:</span>
                  <p className="text-[#9aa1ac]">
                    On any race card in the calendar or in the Dashboard Countdown card, click the <strong>&ldquo;Watch GPX&rdquo;</strong> button to open the interactive export modal and brand guide.
                  </p>
                </div>
              </div>
            )}

            {/* ELEVATION PROFILES & MAPS */}
            {activeSection === 'maps' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-[#7c8f5c]" />
                  Interactive SVG Elevation Scrubber &amp; 4 Map Layers
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Interactive Elevation Scrubber:</strong> Hover or drag your finger across any elevation profile chart to see real-time distance in kilometers, altitude ASL in meters, gradient slope percentage, and named climbs (e.g. <em>Polly Shortts, Fields Hill, Constantia Nek</em>).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Water Points &amp; Checkpoint Waypoints:</strong> Course charts plot exact aid stations, Coke points, energy tables, and intermediate cut-off gates.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">4 Watermark-Free Map Layers:</strong> Switch between <strong>Dark Mode</strong> (contrast road maps), <strong>Esri Topo</strong> (contour lines and mountain relief), <strong>Satellite</strong> (photorealistic aerial survey), and <strong>OpenStreetMap</strong>.
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* COMMUNITY SUBMISSIONS */}
            {activeSection === 'community' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#d8b34a]" />
                  Community Race Submissions &amp; Firestore Cloud Sync
                </h3>
                <p className="text-xs text-[#9aa1ac]">
                  Vasbyt is fueled by the South African running community. Athletes, club captains, and race directors can submit newly sanctioned fixtures or propose course updates.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">How to Submit a Fixture:</strong> Click <strong>&ldquo;+ Submit Race&rdquo;</strong> in the Race Calendar. Provide race name, date, distances, province, city, elevation ascent/descent, and official entry website.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Live Cloud Synchronization:</strong> Submissions are stored in Firebase Cloud Firestore, synchronizing seamlessly across mobile, tablet, and desktop sessions.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Admin Moderation Portal:</strong> Verified Vasbyt administrators review community submissions, verify ASA sanctioning numbers, deduplicate entries, and promote fixtures to the master calendar.
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* 9 PROVINCES, WEATHER & CLUBS */}
            {activeSection === 'provinces_clubs' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#38bdf8]" />
                  9 Athletics Provinces, Live SAST Weather &amp; Clubs
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Live SAST Regional Conditions:</strong> View real-time temperature, wind, and altitude considerations across Central Gauteng (CGA), Western Province (WPA), KwaZulu-Natal (KZNA), and all 9 provinces.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Highveld Altitude vs Coastal Sea Level:</strong> Guidance on racing at 1,753m altitude (Johannesburg/Pretoria) versus humid coastal racing in Durban and Cape Town.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Licensed Clubs &amp; Weekly Time Trials:</strong> Explore club colours, training bases, and weekly 4km / 8km Time Trials (usually Tuesdays &amp; Thursdays 17:30) open to guests and visiting runners.
                    </div>
                  </li>
                </ul>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('provinces');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#38bdf8] text-[#082f49] text-xs font-bold rounded-xs cursor-pointer"
                  >
                    Explore Provinces
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('clubs');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#242c38] text-[#f5efe3] hover:bg-[#2c3645] border border-[#3d4756] text-xs font-semibold rounded-xs cursor-pointer transition-colors"
                  >
                    Search Clubs
                  </button>
                </div>
              </div>
            )}

            {/* RUNNER PASSPORT & CLOUD SYNC */}
            {activeSection === 'passport' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4 text-[#e28b37]" />
                  Runner Passport, ASA License &amp; Seeding Batches
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">1-Click Google Sign-In:</strong> Connect your Google account to sync your athlete profile across devices with zero setup.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Official ASA License Card:</strong> Store your annual ASA license number, provincial board, club affiliation, and age category (Open, 40+, 50+, 60+).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Personal Best Tracker:</strong> Log and benchmark your PB times across 5k, 10k, Half Marathon, Full Marathon, and Ultra distances.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Automatic Comrades Seeding Prediction:</strong> Based on your marathon PB, Vasbyt calculates your predicted start batch (Batch A through H) and cut-off safety margin.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('profile');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e28b37] text-[#1b1103] text-xs font-bold rounded-xs cursor-pointer"
                >
                  View My Runner Passport
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#12151b] border-t border-[#2c333f] flex items-center justify-between">
          <div className="text-[11px] text-[#6d7580] hidden sm:flex items-center gap-2">
            <span>Race day questions? Check organizer contacts on individual race cards.</span>
            <span>•</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d8b34a] hover:underline"
            >
              XML Sitemap
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#242c38] hover:bg-[#2c3645] text-xs font-semibold text-[#f5efe3] rounded-xs cursor-pointer transition-colors ml-auto"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
