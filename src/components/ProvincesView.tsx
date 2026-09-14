import React from 'react';
import { PROVINCES, RACES, CLUBS, DIST_LABEL, formatRaceDate } from '../data/runningData';
import { MapPin, Calendar, Users, ArrowRight, ExternalLink, X } from 'lucide-react';

interface ProvincesViewProps {
  selectedProvinceId: string | null;
  onSelectProvinceId: (id: string | null) => void;
  onNavigateToRaces: (provId: string) => void;
  onNavigateToClubs: (provId: string) => void;
}

export const ProvincesView: React.FC<ProvincesViewProps> = ({
  selectedProvinceId,
  onSelectProvinceId,
  onNavigateToRaces,
  onNavigateToClubs,
}) => {
  const getRaceCount = (provId: string) => RACES.filter((r) => r.prov === provId).length;
  const getClubCount = (provId: string) => CLUBS.filter((c) => c.prov === provId).length;
  const getProvRaces = (provId: string) => RACES.filter((r) => r.prov === provId).slice(0, 3);
  const getProvClubs = (provId: string) => CLUBS.filter((c) => c.prov === provId).slice(0, 3);

  const activeProv = PROVINCES.find((p) => p.id === selectedProvinceId);

  return (
    <div id="view-provinces" className="space-y-6 pb-8 text-left">
      {/* Header */}
      <div className="pb-3 border-b border-[#2c333f]">
        <h1
          id="provinces-pagehead"
          className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-[#f5efe3] leading-none"
        >
          Provincial Federations
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1.5 max-w-2xl">
          South Africa&apos;s 9 provincial athletics bodies oversee official race sanctions, club
          licencing, and cross-country fixtures under Athletics South Africa (ASA).
        </p>
      </div>

      {/* Grid of 9 Provinces */}
      <div id="provinces-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROVINCES.map((p) => {
          const isSelected = selectedProvinceId === p.id;
          const raceCount = getRaceCount(p.id);
          const clubCount = getClubCount(p.id);

          return (
            <div
              key={p.id}
              id={`prov-tile-${p.id}`}
              onClick={() => onSelectProvinceId(isSelected ? null : p.id)}
              className={`bg-[#171c24] border rounded-xs p-5 text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#e28b37] bg-[#221c17] ring-1 ring-[#e28b37] shadow-lg'
                  : 'border-[#2c333f] hover:border-[#6d7580] hover:bg-[#1b222d]'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display font-black text-3xl sm:text-4xl text-[#d8b34a] leading-none">
                    {p.ab}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#7c8f5c] bg-[#7c8f5c]/10 border border-[#7c8f5c]/30 px-2 py-0.5 rounded-full font-bold">
                    ASA Member
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#f5efe3] leading-snug mb-1">
                  {p.name}
                </h3>

                <p className="text-xs text-[#9aa1ac] leading-relaxed line-clamp-2 mb-4">
                  {p.blurb}
                </p>
              </div>

              <div className="pt-3 border-t border-[#2c333f]/70 flex items-center justify-between text-xs">
                <span className="text-[#6d7580]">
                  <b className="text-[#f5efe3]">{raceCount}</b> races ·{' '}
                  <b className="text-[#f5efe3]">{clubCount}</b> clubs
                </span>
                <span className="text-[#e28b37] font-semibold text-xs inline-flex items-center gap-1">
                  {isSelected ? 'Selected' : 'View →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Province Expanded Deep-Dive */}
      {activeProv && (
        <div
          id="province-detail-box"
          className="mt-6 p-6 sm:p-7 bg-[#171c24] border border-[#a86526] rounded-xs text-left animate-in fade-in duration-200 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#2c333f]">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display font-black text-3xl text-[#d8b34a] leading-none">
                  {activeProv.ab}
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#f5efe3] uppercase">
                  {activeProv.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1.5 max-w-3xl leading-relaxed">
                {activeProv.blurb}
              </p>
            </div>

            <button
              onClick={() => onSelectProvinceId(null)}
              className="inline-flex items-center gap-1 text-xs text-[#9aa1ac] hover:text-[#f5efe3] px-3 py-1.5 bg-[#242c38] rounded-xs border border-[#2c333f] cursor-pointer self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              Close Overview
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              id="btn-see-prov-races"
              onClick={() => onNavigateToRaces(activeProv.id)}
              className="inline-flex items-center gap-2 font-semibold text-xs sm:text-sm bg-[#e28b37] text-[#1b1103] hover:bg-[#eb9a4a] py-2.5 px-4 rounded-xs cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Explore all {getRaceCount(activeProv.id)} races in {activeProv.name}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="btn-see-prov-clubs"
              onClick={() => onNavigateToClubs(activeProv.id)}
              className="inline-flex items-center gap-2 font-semibold text-xs sm:text-sm bg-[#242c38] border border-[#2c333f] text-[#f5efe3] hover:border-[#6d7580] py-2.5 px-4 rounded-xs cursor-pointer transition-colors"
            >
              <Users className="w-4 h-4" />
              View {getClubCount(activeProv.id)} licensed clubs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Side-by-Side Preview of Races and Clubs in this Province */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#2c333f]">
            {/* Race Previews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#d8b34a] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#e28b37]" />
                  Upcoming Fixtures in {activeProv.ab}
                </span>
                <button
                  onClick={() => onNavigateToRaces(activeProv.id)}
                  className="text-xs text-[#e28b37] hover:underline"
                >
                  All {getRaceCount(activeProv.id)} →
                </button>
              </div>

              <div className="space-y-2">
                {getProvRaces(activeProv.id).map((race) => (
                  <div
                    key={race.name}
                    className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <b className="text-[#f5efe3] block">{race.name}</b>
                      <span className="text-[#9aa1ac]">
                        {race.city} · {formatRaceDate(race.date).day} {formatRaceDate(race.date).mon}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {race.dist.map((d) => (
                        <span
                          key={d}
                          className="text-[10px] bg-[#242c38] text-[#9aa1ac] px-2 py-0.5 rounded-full"
                        >
                          {DIST_LABEL[d]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Club Previews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#d8b34a] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#e28b37]" />
                  Prominent Clubs in {activeProv.ab}
                </span>
                <button
                  onClick={() => onNavigateToClubs(activeProv.id)}
                  className="text-xs text-[#e28b37] hover:underline"
                >
                  All {getClubCount(activeProv.id)} →
                </button>
              </div>

              <div className="space-y-2">
                {getProvClubs(activeProv.id).map((club) => (
                  <div
                    key={club.name}
                    className="p-3 bg-[#12151b] border border-[#2c333f] rounded-xs flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <b className="text-[#f5efe3] block">{club.name}</b>
                      <span className="text-[#9aa1ac]">
                        {club.city} {club.founded ? `· Est. ${club.founded}` : ''}
                      </span>
                    </div>
                    <span className="text-[10px] bg-[#242c38] text-[#e28b37] px-2 py-0.5 rounded-full font-bold">
                      Licensed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
