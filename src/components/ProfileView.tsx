import React, { useState, useEffect } from 'react';
import { PROVINCES, getProvince } from '../data/runningData';
import { UserProfile, UserFavorites } from '../types';
import {
  User,
  Award,
  MapPin,
  Target,
  Star,
  Check,
  Trash2,
  Cloud,
  CloudCheck,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Hash,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicGoogleSignInButton } from './NeumorphicGoogleSignInButton';

const ATHLETE_CATEGORIES = [
  'Senior (20–39)',
  'Veteran (40–49)',
  'Master (50–59)',
  'Grandmaster (60–69)',
  'Great Grandmaster (70+)',
  'Junior (U20)',
];

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
  const {
    user,
    authLoading,
    loginError,
    syncState,
    lastSyncedAt,
    loginWithGoogle,
    logout,
    clearLoginError,
    saveCloudProfile,
    openLoginModal,
  } = useAuth();

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    onSaveProfile(formData);

    if (user) {
      await saveCloudProfile(formData, favorites);
    }

    setIsSaving(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const homeProv = getProvince(profile.province);

  const starredItems = [
    ...favorites.races.map((r) => ({ kind: 'Race' as const, name: r })),
    ...favorites.clubs.map((c) => ({ kind: 'Club' as const, name: c })),
  ];

  return (
    <div id="view-profile" className="space-y-6 pb-8 text-left">
      {/* Header */}
      <div className="pb-3 border-b border-[#2c333f] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            id="profile-pagehead"
            className="font-display font-extrabold text-2xl sm:text-3xl tracking-wider uppercase text-[#f5efe3] leading-none"
          >
            Runner Passport &amp; Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#9aa1ac] mt-1">
            Manage your personal records, provincial athletics affiliation, and saved fixtures.
          </p>
        </div>

        {/* Cloud Sync Status Indicator */}
        {user && (
          <div className="flex items-center gap-2 bg-[#171c24] border border-[#2c333f] px-3 py-1.5 rounded-xs text-xs text-[#9aa1ac]">
            <span className="w-2 h-2 rounded-full bg-[#7c8f5c] animate-pulse" />
            <Cloud className="w-3.5 h-3.5 text-[#7c8f5c]" />
            <span>
              {syncState === 'saving'
                ? 'Syncing to Cloud…'
                : lastSyncedAt
                ? `Cloud Synced (${lastSyncedAt})`
                : 'Cloud Connected'}
            </span>
          </div>
        )}
      </div>

      {/* Athlete Authentication Card with Neumorphic Styling */}
      <div
        id="profile-google-auth-card"
        className="neu-card rounded-xs p-4 sm:p-5"
      >
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google Profile'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-[#e28b37] object-cover shadow-xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full neu-inset border border-[#e28b37] flex items-center justify-center text-[#e28b37] font-bold text-lg shrink-0">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm sm:text-base text-[#f5efe3]">
                    {user.displayName || profile.name || 'Runner'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7c8f5c] bg-[#7c8f5c]/10 border border-[#7c8f5c]/30 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    {user.isAnonymous ? 'ASA Guest Pass' : 'Cloud Verified'}
                  </span>
                </div>
                <p className="text-xs text-[#9aa1ac] font-mono mt-0.5">
                  {user.email || 'Direct Passport Session'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <NeumorphicButton
                id="btn-switch-account"
                variant="default"
                size="sm"
                onClick={openLoginModal}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#e28b37]" />}
                className="text-xs"
              >
                Switch Account
              </NeumorphicButton>
              <NeumorphicButton
                id="btn-google-signout"
                variant="default"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="w-3.5 h-3.5 text-[#9aa1ac]" />}
                className="text-xs text-[#9aa1ac] hover:text-white"
              >
                Sign Out
              </NeumorphicButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-[#f5efe3] tracking-wide uppercase">
                  Athlete Cloud Passport &amp; Sync
                </h2>
                <span className="text-[10px] uppercase font-bold text-[#e28b37] bg-[#e28b37]/15 border border-[#e28b37]/35 px-2 py-0.5 rounded-full">
                  Instant Sync
                </span>
              </div>
              <p className="text-xs text-[#9aa1ac] max-w-xl leading-relaxed">
                Sign in with Google, your email, or your ASA permanent license number to preserve personal bests, race bookmarks, and provincial club affiliations across all devices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <NeumorphicGoogleSignInButton
                onClick={loginWithGoogle}
                loading={authLoading}
                label="Sign in with Google"
                size="md"
              />
              <NeumorphicButton
                id="btn-open-login-modal-profile"
                variant="primary"
                size="md"
                onClick={openLoginModal}
                leftIcon={<Sparkles className="w-4 h-4 text-[#1a0f02]" />}
              >
                Email / ASA Login
              </NeumorphicButton>
            </div>
          </div>
        )}

        {/* Login Error Notification */}
        {loginError && (
          <div className="mt-3 p-3 bg-[#e24a4a]/10 border border-[#e24a4a]/30 rounded-xs flex items-center justify-between gap-3 text-xs text-[#fca5a5]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#e24a4a]" />
              <span>{loginError}</span>
            </div>
            <button
              onClick={clearLoginError}
              className="text-[#9aa1ac] hover:text-white text-xs underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Responsive Grid: Left Column Passport & Starred, Right Column Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Runner Profile Passport Card */}
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
                ASA Athlete Passport
              </div>
              <div className="flex items-center gap-1.5">
                {formData.licenseNumber && (
                  <span className="text-[10px] uppercase font-mono font-bold text-[#f5efe3] bg-[#242c38] px-2 py-0.5 rounded-xs border border-[#2c333f]">
                    #{formData.licenseNumber}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#d8b34a] bg-[#d8b34a]/15 border border-[#d8b34a]/30 px-2 py-0.5 rounded-full">
                  {homeProv ? homeProv.ab : 'RSA'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 mt-1 mb-2">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={formData.name || 'Runner'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border border-[#e28b37]/50 object-cover shrink-0"
                />
              )}
              <div>
                <h2
                  id="profile-display-name"
                  className="font-display font-bold text-2xl sm:text-3xl text-[#f5efe3] uppercase leading-none"
                >
                  {formData.name || user?.displayName || 'Unnamed Runner'}
                </h2>
                {formData.category && (
                  <span className="text-[10px] text-[#e28b37] font-semibold uppercase tracking-wider block mt-1">
                    {formData.category}
                  </span>
                )}
              </div>
            </div>

            <div id="profile-meta" className="text-xs text-[#9aa1ac] flex items-center gap-1.5 mb-5">
              <MapPin className="w-3.5 h-3.5 text-[#e28b37] shrink-0" />
              <span>
                {formData.club ? `${formData.club} · ` : ''}
                {homeProv ? homeProv.name : 'No home province set'}
              </span>
            </div>

            {/* PB Grid */}
            <div>
              <span className="text-[10.5px] uppercase tracking-wider text-[#6d7580] font-semibold block mb-2">
                Personal Bests
              </span>
              <div id="pb-grid" className="grid grid-cols-5 gap-1.5 sm:gap-2">
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2 text-center">
                  <b className="font-display text-sm sm:text-base text-[#d8b34a] block leading-tight">
                    {formData.pb5k || '—'}
                  </b>
                  <span className="text-[8.5px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    5 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2 text-center">
                  <b className="font-display text-sm sm:text-base text-[#d8b34a] block leading-tight">
                    {formData.pb10k || '—'}
                  </b>
                  <span className="text-[8.5px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    10 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2 text-center">
                  <b className="font-display text-sm sm:text-base text-[#d8b34a] block leading-tight">
                    {formData.pbHalf || '—'}
                  </b>
                  <span className="text-[8.5px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    21.1 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2 text-center">
                  <b className="font-display text-sm sm:text-base text-[#d8b34a] block leading-tight">
                    {formData.pbFull || '—'}
                  </b>
                  <span className="text-[8.5px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    42.2 km
                  </span>
                </div>
                <div className="bg-[#12151b]/80 border border-[#2c333f] rounded-xs p-2 text-center">
                  <b className="font-display text-sm sm:text-base text-[#d8b34a] block leading-tight">
                    {formData.pbUltra || '—'}
                  </b>
                  <span className="text-[8.5px] text-[#6d7580] uppercase tracking-wider block mt-1">
                    Ultra
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Race */}
            {formData.goal && (
              <div
                id="profile-goal-display"
                className="text-xs text-[#9aa1ac] mt-5 pt-3.5 border-t border-[#2c333f] flex items-center gap-2"
              >
                <Target className="w-4 h-4 text-[#e28b37] shrink-0" />
                <span>
                  Season Target: <b className="text-[#f5efe3] font-semibold">{formData.goal}</b>
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
                      onClick={() =>
                        item.kind === 'Race'
                          ? onToggleRaceFavorite(item.name)
                          : onToggleClubFavorite(item.name)
                      }
                      title="Remove bookmark"
                      className="text-[#6d7580] hover:text-[#e24a4a] p-1 rounded-xs transition-colors cursor-pointer shrink-0"
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
          <div className="flex items-center justify-between pb-3 border-b border-[#2c333f] mb-5">
            <h3 className="font-display font-bold text-lg text-[#f5efe3] uppercase tracking-wide">
              Edit Passport Details
            </h3>
            {user && (
              <span className="text-[10.5px] text-[#7c8f5c] font-semibold flex items-center gap-1 bg-[#7c8f5c]/10 border border-[#7c8f5c]/30 px-2 py-0.5 rounded-full">
                <Cloud className="w-3 h-3" />
                Firestore Synced
              </span>
            )}
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder={user?.displayName || 'e.g. Sipho Sithole'}
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="pf-license"
                  className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold flex items-center justify-between"
                >
                  <span>ASA License / Bib #</span>
                  <span className="text-[10px] text-[#6d7580] lowercase">optional</span>
                </label>
                <input
                  id="pf-license"
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  placeholder="e.g. 2026-ASA-14920"
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="pf-province"
                  className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold"
                >
                  Athletics Province
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
                  Registered Club
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

              <div className="space-y-1.5">
                <label
                  htmlFor="pf-category"
                  className="block text-[11px] uppercase tracking-wider text-[#6d7580] font-semibold"
                >
                  Age Category
                </label>
                <select
                  id="pf-category"
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-3.5 py-2.5 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37]"
                >
                  <option value="">Select Category…</option>
                  {ATHLETE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Bests Section */}
            <div className="pt-2">
              <span className="block text-[11px] uppercase tracking-wider text-[#d8b34a] font-bold mb-2.5">
                Personal Bests (Official Time Records)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
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
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-2.5 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
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
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-2.5 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
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
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-2.5 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
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
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-2.5 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label
                    htmlFor="pf-ultra"
                    className="block text-[10px] uppercase tracking-wider text-[#6d7580] font-medium"
                  >
                    Ultra (50km+)
                  </label>
                  <input
                    id="pf-ultra"
                    type="text"
                    value={formData.pbUltra || ''}
                    onChange={(e) => handleChange('pbUltra', e.target.value)}
                    placeholder="h:mm:ss"
                    className="w-full bg-[#12151b] border border-[#2c333f] rounded-xs px-2.5 py-2 text-[#f5efe3] text-sm focus:outline-none focus:border-[#e28b37] text-center"
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

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2c333f]">
              <div className="flex items-center gap-3">
                <NeumorphicButton
                  id="pf-save-btn"
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSaving}
                  leftIcon={user ? <Cloud className="w-4 h-4 text-[#1a0f02]" /> : undefined}
                >
                  {user ? 'Save & Sync to Cloud' : 'Save Profile Changes'}
                </NeumorphicButton>
                {showSavedToast && (
                  <span
                    id="pf-savemsg"
                    className="inline-flex items-center gap-1.5 text-xs text-[#7c8f5c] font-bold animate-in fade-in"
                  >
                    <Check className="w-4 h-4 text-[#7c8f5c]" />
                    {user ? 'Profile synced to Cloud!' : 'Profile saved locally!'}
                  </span>
                )}
              </div>

              {!user && (
                <p className="text-[11px] text-[#6d7580] italic">
                  Saved locally in browser. Sign in with Google above to back up to cloud.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
