import React, { useState, useCallback, useEffect } from 'react';
import { TabType, UserProfile, UserFavorites, CommunityRaceSubmission } from './types';
import { TopBar } from './components/TopBar';
import { TabBar } from './components/TabBar';
import { HomeView } from './components/HomeView';
import { ProvincesView } from './components/ProvincesView';
import { RacesView } from './components/RacesView';
import { ClubsView } from './components/ClubsView';
import { ProfileView } from './components/ProfileView';
import { HowToModal } from './components/HowToModal';
import { SitemapModal } from './components/SitemapModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { NeumorphicLoginModal } from './components/NeumorphicLoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  subscribeToCommunityRaces,
  createCommunityRace,
  deleteCommunityRace,
  StoredCommunityRace,
} from './services/communityRaces';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  province: '',
  club: '',
  licenseNumber: '',
  category: '',
  pb5k: '',
  pb10k: '',
  pbHalf: '',
  pbFull: '',
  pbUltra: '',
  goal: '',
};

const DEFAULT_FAVORITES: UserFavorites = {
  races: [],
  clubs: [],
};

interface AppLayoutProps {
  profile: UserProfile;
  favorites: UserFavorites;
  onSaveProfile: (profile: UserProfile) => void;
  onToggleRaceFavorite: (raceName: string) => void;
  onToggleClubFavorite: (clubName: string) => void;
}

function AppLayout({
  profile,
  favorites,
  onSaveProfile,
  onToggleRaceFavorite,
  onToggleClubFavorite,
}: AppLayoutProps) {
  const { user, isLoginModalOpen, closeLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [raceFilterProv, setRaceFilterProv] = useState<string>('all');
  const [raceFilterDiscipline, setRaceFilterDiscipline] = useState<string>('all');
  const [clubFilterProv, setClubFilterProv] = useState<string>('all');
  const [isHowToOpen, setIsHowToOpen] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Live community races synced from Firestore and local cache
  const [communityRaces, setCommunityRaces] = useState<StoredCommunityRace[]>([]);

  useEffect(() => {
    const unsub = subscribeToCommunityRaces((races) => {
      setCommunityRaces(races);
    });
    return () => unsub();
  }, []);

  const handleAddRace = async (submission: CommunityRaceSubmission) => {
    await createCommunityRace(submission, user);
  };

  const handleDeleteCommunityRace = async (raceId: string) => {
    await deleteCommunityRace(raceId, user);
  };

  // Navigation callbacks
  const handleHomeSelectProvince = (provId: string) => {
    setSelectedProvinceId(provId);
    setActiveTab('provinces');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRaces = (provId: string, disc?: string) => {
    setRaceFilterProv(provId);
    if (disc) {
      setRaceFilterDiscipline(disc);
    }
    setActiveTab('races');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeSelectRaceTab = (disc?: string) => {
    if (disc) {
      setRaceFilterDiscipline(disc);
    }
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
      {/* Top Header with Desktop Navigation, Google Login, SAST Clock & HOW TO button */}
      <TopBar
        activeTab={activeTab}
        onTabChange={handleTabSwitch}
        favoriteCount={totalFavorites}
        onOpenHowTo={() => setIsHowToOpen(true)}
      />

      {/* Main View Area with expansive max-width container */}
      <main id="main-content" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        {activeTab === 'home' && (
          <HomeView
            onSelectProvince={handleHomeSelectProvince}
            onSelectRaceTab={handleHomeSelectRaceTab}
            onOpenHowTo={() => setIsHowToOpen(true)}
            communityRaces={communityRaces}
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
            activeDiscipline={raceFilterDiscipline}
            onSelectDiscipline={setRaceFilterDiscipline}
            favorites={favorites.races}
            onToggleFavorite={onToggleRaceFavorite}
            communityRaces={communityRaces}
            onAddRace={handleAddRace}
            onDeleteCommunityRace={handleDeleteCommunityRace}
          />
        )}

        {activeTab === 'clubs' && (
          <ClubsView
            activeProv={clubFilterProv}
            onSelectProv={setClubFilterProv}
            favorites={favorites.clubs}
            onToggleFavorite={onToggleClubFavorite}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            favorites={favorites}
            onSaveProfile={onSaveProfile}
            onToggleRaceFavorite={onToggleRaceFavorite}
            onToggleClubFavorite={onToggleClubFavorite}
            communityRaces={communityRaces}
            onDeleteCommunityRace={handleDeleteCommunityRace}
          />
        )}
      </main>

      {/* Desktop Footer with HOW TO action link */}
      <footer id="app-footer" className="hidden md:block border-t border-[#2c333f]/70 bg-[#12151b] py-6 text-center text-xs text-[#6d7580]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black tracking-wider text-[#f5efe3] text-sm mr-1">
              VAS<span className="text-[#e28b37]">BYT</span>
            </span>
            <span>South Africa&apos;s Road, Trail, Walking, Hiking &amp; Trekking Fixture Guide</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-[#6d7580]">
            <button
              id="footer-privacy-btn"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-[#9aa1ac] hover:text-[#f5efe3] underline cursor-pointer font-medium"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              id="footer-sitemap-btn"
              onClick={() => setIsSitemapOpen(true)}
              className="text-[#9aa1ac] hover:text-[#f5efe3] underline cursor-pointer font-medium"
            >
              XML Sitemap
            </button>
            <span>•</span>
            <span>Athletics South Africa (ASA) Provincial Calendars</span>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabSwitch}
        onOpenHowTo={() => setIsHowToOpen(true)}
      />

      {/* Global How To Interactive Guide Modal */}
      <HowToModal
        isOpen={isHowToOpen}
        onClose={() => setIsHowToOpen(false)}
        onNavigateTab={(tab) => {
          setIsHowToOpen(false);
          handleTabSwitch(tab);
        }}
      />

      {/* Global XML Sitemap Modal */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onNavigateTab={(tab) => {
          setIsSitemapOpen(false);
          handleTabSwitch(tab);
        }}
      />

      {/* Global Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Global Neumorphic Login & Athlete Registration Modal */}
      <NeumorphicLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </div>
  );
}

export default function App() {
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

  // Called when cloud sync updates profile & favorites from Firestore
  const handleProfileSyncedFromCloud = useCallback((cloudProfile: UserProfile, cloudFavorites: UserFavorites) => {
    setProfile(cloudProfile);
    setFavorites(cloudFavorites);
    try {
      localStorage.setItem('vasbyt:profile', JSON.stringify(cloudProfile));
      localStorage.setItem('vasbyt:favorites', JSON.stringify(cloudFavorites));
    } catch (e) {
      console.error('Error saving synced profile to localStorage', e);
    }
  }, []);

  // Save profile locally
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

  return (
    <AuthProvider
      currentLocalProfile={profile}
      currentLocalFavorites={favorites}
      onProfileSyncedFromCloud={handleProfileSyncedFromCloud}
    >
      <AppLayout
        profile={profile}
        favorites={favorites}
        onSaveProfile={handleSaveProfile}
        onToggleRaceFavorite={handleToggleRaceFavorite}
        onToggleClubFavorite={handleToggleClubFavorite}
      />
    </AuthProvider>
  );
}
