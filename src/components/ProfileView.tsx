import React, { useState, useEffect } from 'react';
import { PROVINCES, getProvince } from '../data/runningData';
import { UserProfile, UserFavorites } from '../types';
import { User, Award, MapPin, Target, Star, Check, Trash2 } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  favorites: UserFavorites;
  onSaveProfile: (profile: UserProfile) => void;
  onToggleRaceFavorite: (raceName: string) => void;
  onToggleClubFavorite: (clubName: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  favorites,
  onSaveProfile,
  onToggleRaceFavorite,
  onToggleClubFavorite,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const homeProv = getProvince(profile.province);

  const starredItems = [
    ...favorites.races.map((r) => ({ kind: 'Race' as const, name: r })),
    ...favorites.clubs.map((c) => ({ kind: 'Club' as const, name: c })),
  ];

  return (
    <div id="view-profile" className="space-y-6 pb-8 text-left">
      {/* Header */}
      <div className="pb-3 border-b border-[#2c333f]">
        <h1
          id="profile-pagehead"
          className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-[#f5efe3] leading-none"
        >
          Runner Passport
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1">
          Manage your personal records, provincial athletics affiliation, and saved race fixtures.
        </p>
      </div>

      {/* Responsive Grid: Left Column Passport & Starred, Right Column Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Runner Profile Card */}
          <div
            id="profile-card"
            className="bg-gradient-to-br from-[#241a10] via-[#1a1f29] to-[#12151b] border border-[#a86526] rounded-xs p-6 shadow-xl relative overflow-hidden"
          >
            {/* Background watermark icon */}
            <Award className="absolute -right-6 -bottom-6 w-36 h-36 text-[#e28b37]/5 pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div
                id="profile-bib"
                className="font-display font-black text-xs tracking-widest text-[#e28b37] uppercase flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                ASA Athlete Profile
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#d8b34a] bg-[#d8b34a]/15 border border-[#d8b34a]/30 px-2 py-0.5 rounded-full">
                {homeProv ? homeProv.ab : 'RSA'}
              </span>
            </div>

            <h2
              id="profile-display-name"
              className="font-display font-bold text-3xl sm:text-4xl text-[#f5efe3] uppercase leading-none mt-1 mb-2"
            >
              {profile.name || 'Unnamed Runner'}
            </h2>

            <div id="profile-meta" className="text-xs sm:text-sm text-[#9aa1ac] flex items-center gap-1.5 mb-5">
              <MapPin className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
              <span>
                {profile.club ? `${profile.club} · ` : ''}
                {homeProv ? homeProv.name : 'No home province set'}
              </span>
            </div>

            {/* PB Grid */}
            <div>
              <span className="text-[10.5px] uppercase tracking-wider text-[#6d7580] font-semibold block mb-2">
                Personal Bests
              </span>
              <div id="pb-grid" className="grid grid-cols-4 gap-2">
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2.5 text-center">
                  <b className="font-display text-base sm:text-lg text-[#d8b34a] block leading-tight">
                    {profile.pb5k || '—'}
                  </b>
                  <span className="text-[9px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    5 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2.5 text-center">
                  <b className="font-display text-base sm:text-lg text-[#d8b34a] block leading-tight">
                    {profile.pb10k || '—'}
                  </b>
                  <span className="text-[9px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    10 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2.5 text-center">
                  <b className="font-display text-base sm:text-lg text-[#d8b34a] block leading-tight">
                    {profile.pbHalf || '—'}
                  </b>
                  <span className="text-[9px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    21.1 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2.5 text-center">
                  <b className="font-display text-base sm:text-lg text-[#d8b34a] block leading-tight">
                    {profile.pbFull || '—'}
                  </b>
                  <span className="text-[9px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    42.2 km
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Race */}
            {profile.goal && (
              <div
                id="profile-goal-display"
                className="text-xs text-[#9aa1ac] mt-5 pt-3.5 border-t border-[#2c333f] flex items-center gap-2"
              >
                <Target className="w-4 h-4 text-[#e28b37] shrink-0" />
                <span>
                  Season Target: <b className="text-[#f5efe3] font-semibold">{profile.goal}</b>
                </span>
              </div>
            )}
          </div>

          {/* Starred Races & Clubs Card */}
          <div id="starred-section" className="bg-[#171c24] border border-[#2c333f] rounded-xs p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#2c333f] mb-3">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[#d8b34a] flex items-center gap-2">
                <Star className="w-4 h-4 text-[#d8b34a] fill-[#d8b34a]" />
                Starred Fixtures &amp; Clubs ({starredItems.length})
              </h3>
            </div>

            {starredItems.length === 0 ? (
              <div id="starred-empty" className="text-xs text-[#6d7580] py-6 text-center">
                Tap the star icon on any race card or club in the directory to bookmark it here for quick access.
              </div>
            ) : (
              <div id="starred-list" className="divide-y divide-[#2c333f] max-h-72 overflow-y-auto pr-1">
                {starredItems.map((item) => (
                  <div
                    key={`${item.kind}-${item.name}`}
                    className="flex justify-between items-center py-2.5 text-xs hover:bg-[#12151b]/40 px-1 rounded-xs"
                  >
                    <div className="flex items-center gap-2 truncate min-w-0 pr-2">
                      <span className="text-[10px] text-[#e28b37] font-mono uppercase bg-[#242c38] px-1.5 py-0.5 rounded-xs shrink-0 font-bold">
                        {item.kind}
                      </span>
                      <span className="text-[#f5efe3] font-medium truncate">{item.name}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (item.kind === 'Race') onToggleRaceFavorite(item.name);
                        else onToggleClubFavorite(item.name);
                      }}
                      title="Remove from favorites"
                      className="text-[#6d7580] hover:text-[#b5502f] p-1 cursor-pointer shrink-0 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#171c24] border border-[#2c333f] rounded-xs p-6 sm:p-7 shadow-sm">
          <h3 className="font-display font-bold text-lg text-[#f5efe3] uppercase tracking-wide pb-3 border-b border-[#2c333f] mb-5">
            Edit Passport Details
          </h3>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="pf-name"
                className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold"
              >
                Runner Full Name
              </label>
              <input
                id="pf-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Sipho Sithole"
                className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="pf-province"
                  className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold"
                >
                  Home Athletics Province
                </label>
                <select
                  id="pf-province"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
                >
                  <option value="">Select Province…</option>
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.ab})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="pf-club"
                  className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold"
                >
                  Registered Running Club
                </label>
                <input
                  id="pf-club"
                  type="text"
                  value={formData.club}
                  onChange={(e) => handleChange('club', e.target.value)}
                  placeholder="e.g. Benoni Northerns AC"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
                />
              </div>
            </div>

            {/* Personal Bests Section */}
            <div className="pt-2">
              <span className="block text-[11px] uppercase tracking-wider text-[#d8b34a] font-bold mb-2.5">
                Personal Bests (PB Times)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="pf-5k"
                    className="block text-[10px] uppercase tracking-wider text-[#6d7580] font-medium"
                  >
                    5km PB
                  </label>
                  <input
                    id="pf-5k"
                    type="text"
                    value={formData.pb5k}
                    onChange={(e) => handleChange('pb5k', e.target.value)}
                    placeholder="mm:ss"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="pf-10k"
                    className="block text-[10px] uppercase tracking-wider text-[#6d7580] font-medium"
                  >
                    10km PB
                  </label>
                  <input
                    id="pf-10k"
                    type="text"
                    value={formData.pb10k}
                    onChange={(e) => handleChange('pb10k', e.target.value)}
                    placeholder="mm:ss"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="pf-half"
                    className="block text-[10px] uppercase tracking-wider text-[#6d7580] font-medium"
                  >
                    Half Marathon
                  </label>
                  <input
                    id="pf-half"
                    type="text"
                    value={formData.pbHalf}
                    onChange={(e) => handleChange('pbHalf', e.target.value)}
                    placeholder="h:mm:ss"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="pf-full"
                    className="block text-[10px] uppercase tracking-wider text-[#6d7580] font-medium"
                  >
                    Full Marathon
                  </label>
                  <input
                    id="pf-full"
                    type="text"
                    value={formData.pbFull}
                    onChange={(e) => handleChange('pbFull', e.target.value)}
                    placeholder="h:mm:ss"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label
                htmlFor="pf-goal"
                className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold"
              >
                Key Target Race This Season
              </label>
              <input
                id="pf-goal"
                type="text"
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                placeholder="e.g. Comrades Marathon Up Run / Soweto Marathon 42.2km"
                className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
              />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#2c333f]">
              <button
                id="pf-save-btn"
                type="submit"
                className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm bg-[#e28b37] text-[#1b1103] hover:bg-[#eb9a4a] py-2.5 px-5 rounded-xs cursor-pointer transition-colors"
              >
                Save Profile Changes
              </button>
              {showSavedToast && (
                <span
                  id="pf-savemsg"
                  className="inline-flex items-center gap-1.5 text-xs text-[#7c8f5c] font-bold animate-in fade-in"
                >
                  <Check className="w-4 h-4 text-[#7c8f5c]" />
                  Profile updated successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
