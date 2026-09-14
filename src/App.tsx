import React, { useState, useEffect } from 'react';
import { TabType, UserProfile, UserFavorites } from './types';
import { TopBar } from './components/TopBar';
import { TabBar } from './components/TabBar';
import { HomeView } from './components/HomeView';
import { ProvincesView } from './components/ProvincesView';
import { RacesView } from './components/RacesView';
import { ClubsView } from './components/ClubsView';
import { ProfileView } from './components/ProfileView';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  province: '',
  club: '',
  pb5k: '',
  pb10k: '',
  pbHalf: '',
  pbFull: '',
  goal: '',
};

const DEFAULT_FAVORITES: UserFavorites = {
  races: [],
  clubs: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [raceFilterProv, setRaceFilterProv] = useState<string>('all');
  const [clubFilterProv, setClubFilterProv] = useState<string>('all');

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('vasbyt:profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  });

  const [favorites, setFavorites] = useState<UserFavorites>(() => {
    try {
      const stored = localStorage.getItem('vasbyt:favorites');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    return DEFAULT_FAVORITES;
  });

  // Save profile to localStorage whenever it changes
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('vasbyt:profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
    }
  };

  // Toggle favorite race
  const handleToggleRaceFavorite = (raceName: string) => {
    setFavorites((prev) => {
      const exists = prev.races.includes(raceName);
      const nextRaces = exists
        ? prev.races.filter((n) => n !== raceName)
        : [...prev.races, raceName];
      const updated = { ...prev, races: nextRaces };
      try {
        localStorage.setItem('vasbyt:favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving favorites to localStorage', e);
      }
      return updated;
    });
  };

  // Toggle favorite club
  const handleToggleClubFavorite = (clubName: string) => {
    setFavorites((prev) => {
      const exists = prev.clubs.includes(clubName);
      const nextClubs = exists
        ? prev.clubs.filter((n) => n !== clubName)
        : [...prev.clubs, clubName];
      const updated = { ...prev, clubs: nextClubs };
      try {
        localStorage.setItem('vasbyt:favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving favorites to localStorage', e);
      }
      return updated;
    });
  };

  // Navigation callbacks
  const handleHomeSelectProvince = (provId: string) => {
    setSelectedProvinceId(provId);
    setActiveTab('provinces');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRaces = (provId: string) => {
    setRaceFilterProv(provId);
    setActiveTab('races');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToClubs = (provId: string) => {
    setClubFilterProv(provId);
    setActiveTab('clubs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalFavorites = favorites.races.length + favorites.clubs.length;

  return (
    <div
      id="app"
      className="min-h-screen flex flex-col bg-[#12151b] text-[#f5efe3] pb-20 md:pb-10"
    >
      {/* Top Header with Desktop Navigation & SAST Clock */}
      <TopBar
        activeTab={activeTab}
        onTabChange={handleTabSwitch}
        favoriteCount={totalFavorites}
      />

      {/* Main View Area with expansive max-width container */}
      <main id="main-content" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        {activeTab === 'home' && (
          <HomeView
            onSelectProvince={handleHomeSelectProvince}
            onSelectRaceTab={() => handleTabSwitch('races')}
          />
        )}

        {activeTab === 'provinces' && (
          <ProvincesView
            selectedProvinceId={selectedProvinceId}
            onSelectProvinceId={setSelectedProvinceId}
            onNavigateToRaces={handleNavigateToRaces}
            onNavigateToClubs={handleNavigateToClubs}
          />
        )}

        {activeTab === 'races' && (
          <RacesView
            activeProv={raceFilterProv}
            onSelectProv={setRaceFilterProv}
            favorites={favorites.races}
            onToggleFavorite={handleToggleRaceFavorite}
          />
        )}

        {activeTab === 'clubs' && (
          <ClubsView
            activeProv={clubFilterProv}
            onSelectProv={setClubFilterProv}
            favorites={favorites.clubs}
            onToggleFavorite={handleToggleClubFavorite}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            favorites={favorites}
            onSaveProfile={handleSaveProfile}
            onToggleRaceFavorite={handleToggleRaceFavorite}
            onToggleClubFavorite={handleToggleClubFavorite}
          />
        )}
      </main>

      {/* Desktop Footer */}
      <footer id="app-footer" className="hidden md:block border-t border-[#2c333f]/70 bg-[#12151b] py-6 text-center text-xs text-[#6d7580]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-display font-black tracking-wider text-[#f5efe3] text-sm mr-2">
              VAS<span className="text-[#e28b37]">BYT</span>
            </span>
            <span>South Africa&apos;s Road, Trail &amp; Track Running Fixture Guide</span>
          </div>
          <div className="text-[11px] text-[#6d7580]">
            Athletics South Africa (ASA) Provincial Calendars &amp; Licensed Running Clubs
          </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <TabBar activeTab={activeTab} onTabChange={handleTabSwitch} />
    </div>
  );
}
