import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  MapPin,
  Calendar,
  Users,
  User,
  Star,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TabType } from '../types';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const HowToModal: React.FC<HowToModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'races' | 'provinces' | 'clubs' | 'maps' | 'profile'>('overview');

  if (!isOpen) return null;

  const sections = [
    { id: 'overview', title: 'Quick Tour', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'races', title: 'Race Calendar & Seeding', icon: <Calendar className="w-4 h-4" /> },
    { id: 'maps', title: 'Interactive Maps & GPX', icon: <Layers className="w-4 h-4" /> },
    { id: 'provinces', title: '9 Provinces & Weather', icon: <MapPin className="w-4 h-4" /> },
    { id: 'clubs', title: 'Club Finder & Time Trials', icon: <Users className="w-4 h-4" /> },
    { id: 'profile', title: 'Runner Passport & Sync', icon: <User className="w-4 h-4" /> },
  ] as const;

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
            <div className="w-9 h-9 rounded-xs bg-[#e28b37]/15 border border-[#e28b37]/35 flex items-center justify-center text-[#e28b37]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl tracking-wide uppercase text-[#f5efe3] leading-none">
                How To Use Vasbyt
              </h2>
              <p className="text-xs text-[#9aa1ac] mt-1">
                Your complete guide to South African road, trail &amp; track running.
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
          <div className="w-full md:w-60 bg-[#141820] border-b md:border-b-0 md:border-r border-[#2c333f] p-2 sm:p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`howto-nav-${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#242c38] text-[#e28b37] border border-[#e28b37]/40 shadow-xs'
                      : 'text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#1b212b] border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-[#e28b37]' : 'text-[#6d7580]'}>
                    {sec.icon}
                  </span>
                  <span>{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Section Reader */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-[#cfd4dc] text-sm leading-relaxed">
            {activeSection === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e28b37]" />
                    Welcome to Vasbyt SA Running
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1.5">
                    <strong>&ldquo;Vasbyt&rdquo;</strong> is the quintessential South African runner&apos;s ethos: hang in there, endure, and finish strong. This app brings together everything you need to run, train, and race across all 9 provinces.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="bg-[#12151b] border border-[#2c333f] p-3.5 rounded-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d8b34a]">
                      <Calendar className="w-4 h-4 text-[#d8b34a]" />
                      1. Race Calendar
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      Explore verified ASA road marathons, trail fixtures, Comrades qualifiers, and Two Oceans seeding races with cut-off times.
                    </p>
                  </div>

                  <div className="bg-[#12151b] border border-[#2c333f] p-3.5 rounded-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7c8f5c]">
                      <Layers className="w-4 h-4 text-[#7c8f5c]" />
                      2. Interactive Maps
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      View route profiles, water point intervals, cut-off points, elevation charts, and GPX download files with 4 free map themes.
                    </p>
                  </div>

                  <div className="bg-[#12151b] border border-[#2c333f] p-3.5 rounded-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                      <MapPin className="w-4 h-4 text-[#38bdf8]" />
                      3. 9 Athletics Provinces
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      Discover terrain overviews, live regional weather conditions, altitude advice, and provincial athletics contacts.
                    </p>
                  </div>

                  <div className="bg-[#12151b] border border-[#2c333f] p-3.5 rounded-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e28b37]">
                      <User className="w-4 h-4 text-[#e28b37]" />
                      4. Runner Passport
                    </div>
                    <p className="text-xs text-[#9aa1ac]">
                      Sign in with Google to sync your ASA license, personal bests, category, and bookmarked races to the cloud.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('races');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#e28b37] text-[#1b1103] hover:bg-[#eb9a4a] text-xs font-bold rounded-xs cursor-pointer transition-colors"
                  >
                    Go to Race Calendar
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('profile');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#242c38] text-[#f5efe3] hover:bg-[#2c3645] border border-[#3d4756] text-xs font-semibold rounded-xs cursor-pointer transition-colors"
                  >
                    Setup My Profile
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'races' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d8b34a]" />
                  Finding &amp; Filtering Races
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Filter by Province &amp; Distance:</strong> Use the provincial buttons (e.g. <em>CGA, WPA, KZNA</em>) or distance tags (<em>10km, 21.1km, 42.2km, Ultra</em>) to narrow down upcoming events.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Comrades &amp; Two Oceans Qualifiers:</strong> Look for the gold <em>&ldquo;Comrades Qualifier&rdquo;</em> tag on marathon and ultra events to confirm official ASA qualifying status.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Starring Fixtures:</strong> Click the star icon (★) on any race card to save it to your personal shortlist in your Runner Passport.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Cut-off Times &amp; Entry Links:</strong> Expand any race to see gun start times, cut-off hours, elevation gain, timing chips, and direct registration links.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('races');
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e28b37] text-[#1b1103] text-xs font-bold rounded-xs cursor-pointer"
                >
                  Open Race Calendar
                </button>
              </div>
            )}

            {activeSection === 'maps' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#7c8f5c]" />
                  Interactive Maps, Water Points &amp; GPX
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">4 Free Map Themes (No Watermarks):</strong> In the top-right of any course map, choose between <strong>Dark</strong> (night navigation), <strong>Topo</strong> (Esri contours and mountain passes), <strong>Satellite</strong> (aerial imagery), or <strong>Street</strong>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Waypoints &amp; Aid Stations:</strong> Toggle icons along the course showing water stations, Coke points, energy tables, key climbs, and intermediate cut-off checkpoints.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">GPX Track Download:</strong> Download the race route directly as a <code>.gpx</code> file to sync to your Garmin, Coros, Suunto, or Apple Watch.
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {activeSection === 'provinces' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#38bdf8]" />
                  Exploring South Africa&apos;s 9 Athletics Regions
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Live SAST Regional Conditions:</strong> View real-time temperature, humidity, and altitude considerations across each province (e.g. Highveld altitude vs. coastal humidity).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Provincial Bodies:</strong> Access official contacts and websites for Central Gauteng Athletics (CGA), Western Province Athletics (WPA), KwaZulu-Natal Athletics (KZNA), and all ASA member boards.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('provinces');
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e28b37] text-[#1b1103] text-xs font-bold rounded-xs cursor-pointer"
                >
                  Explore Provinces
                </button>
              </div>
            )}

            {activeSection === 'clubs' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#e28b37]" />
                  Club Directory &amp; Weekly Time Trials
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Find Your Running Community:</strong> Browse licensed clubs with colours, meeting venues, and club focus (road racing, trail, social groups, or ultra training).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Weekly Time Trials (TTs):</strong> Check weekly time-trial schedules (usually Tuesdays or Thursdays 17:30–18:00) with 4km and 8km timed loops open to visitors.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('clubs');
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e28b37] text-[#1b1103] text-xs font-bold rounded-xs cursor-pointer"
                >
                  Search Clubs
                </button>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-display font-bold text-base text-[#f5efe3] uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4 text-[#e28b37]" />
                  Runner Passport &amp; Google Cloud Sync
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">1-Click Google Sign-In:</strong> Click &ldquo;Sign In&rdquo; in the top bar or Profile tab to connect your Google account securely.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Save PBs &amp; ASA License:</strong> Log your personal best times across 5k, 10k, Half Marathon, Full Marathon, and Ultra distances, plus your official ASA annual license number and age category.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7c8f5c] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#f5efe3]">Cloud Synchronization:</strong> All saved personal records and starred races are stored in Firebase Cloud Firestore, automatically staying in sync whether you view on your mobile or desktop.
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('profile');
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e28b37] text-[#1b1103] text-xs font-bold rounded-xs cursor-pointer"
                >
                  View My Passport
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#12151b] border-t border-[#2c333f] flex items-center justify-between">
          <div className="text-[11px] text-[#6d7580] hidden sm:flex items-center gap-2">
            <span>Need help on race day? Check each race card for organizer and emergency contacts.</span>
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
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
};
