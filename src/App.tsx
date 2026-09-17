import React, { useState, useCallback, useEffect } from 'react';
import { TabType, UserProfile, UserFavorites, CommunityRaceSubmission, Race } from './types';
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
import { AdminPortalView } from './components/AdminPortalView';
import { WatchSyncModal } from './components/WatchSyncModal';
import { getEnrichedRaceRoute } from './utils/routeData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Shield } from 'lucide-react';
import {
  subscribeToCommunityRaces,
  createCommunityRace,
  deleteCommunityRace,
  saveOrUpdateRace,
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
  const { user, isAdmin, isLoginModalOpen, closeLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [raceFilterProv, setRaceFilterProv] = useState<string>('all');
  const [raceFilterDiscipline, setRaceFilterDiscipline] = useState<string>('all');
  const [clubFilterProv, setClubFilterProv] = useState<string>('all');
  const [isHowToOpen, setIsHowToOpen] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [syncModalRace, setSyncModalRace] = useState<Race | null>(null);

  // Live community races synced from Firestore and local cache
  const [communityRaces, setCommunityRaces] = useState<StoredCommunityRace[]>([]);

  useEffect(() => {
    const unsub = subscribeToCommunityRaces((races) => {
      setCommunityRaces(races);
    });
    return () => unsub();
  }, []);

  const handleAddRace = async (submission: CommunityRaceSubmission) => {
    const newRecord = await createCommunityRace(submission, user);
    // Optimistically update community races immediately so it appears on the calendar instantly
    setCommunityRaces((prev) => {
      const filtered = prev.filter((r) => r.id !== newRecord.id);
      const updated = [newRecord, ...filtered];
      updated.sort((a, b) => a.date.localeCompare(b.date));
      return updated;
    });
    // Automatically switch to the race calendar tab and clear restrictive filters
    setRaceFilterProv('all');
    setRaceFilterDiscipline('all');
    setActiveTab('races');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCommunityRace = async (raceId: string) => {
    await deleteCommunityRace(raceId, user);
    setCommunityRaces((prev) => prev.filter((r) => r.id !== raceId));
  };

  const handleUpdateRace = async (submission: CommunityRaceSubmission, originalRace: Race) => {
    const updatedRecord = await saveOrUpdateRace(submission, originalRace, user);
    setCommunityRaces((prev) => {
      const filtered = prev.filter((r) => r.id !== updatedRecord.id);
      const updated = [updatedRecord, ...filtered];
      updated.sort((a, b) => a.date.localeCompare(b.date));
      return updated;
    });
  };

  // Navigation callbacks
  const handleHomeSelectProvince = (provId: string) => {
    handleNavigateToRaces(provId);
  };

  const handleSelectProvinceId = (provId: string | null) => {
    if (provId) {
      handleNavigateToRaces(provId);
    } else {
      setSelectedProvinceId(null);
    }
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
            favorites={favorites.races}
            onToggleFavorite={onToggleRaceFavorite}
            onOpenSyncModal={setSyncModalRace}
          />
        )}

        {activeTab === 'provinces' && (
          <ProvincesView
            selectedProvinceId={selectedProvinceId}
            onSelectProvinceId={handleSelectProvinceId}
            onNavigateToRaces={handleNavigateToRaces}
            onNavigateToClubs={handleNavigateToClubs}
            communityRaces={communityRaces}
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
            onDeleteCommunityRace={isAdmin ? handleDeleteCommunityRace : undefined}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortalView
            communityRaces={communityRaces}
            onAddRace={handleAddRace}
            onUpdateRace={handleUpdateRace}
            onDeleteCommunityRace={handleDeleteCommunityRace}
            onNavigateTab={handleTabSwitch}
          />
        )}
      </main>

      {/* Global Application Footer with Admin Portal, Privacy Policy & Sitemap */}
      <footer id="app-footer" className="border-t border-[#2c333f]/70 bg-[#12151b] py-6 text-center text-xs text-[#6d7580]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-black tracking-wider text-[#f5efe3] text-sm mr-1">
              VAS<span className="text-[#e28b37]">BYT</span>
            </span>
            <span>South Africa&apos;s Road, Trail, Walking, Hiking &amp; Trekking Fixture Guide</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-[#6d7580]">
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
            <button
              id="footer-admin-portal-btn"
              onClick={() => handleTabSwitch('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                activeTab === 'admin'
                  ? 'bg-[#d8b34a] text-[#12151b] border-[#d8b34a]'
                  : 'bg-[#171c24] text-[#d8b34a] border-[#d8b34a]/40 hover:border-[#d8b34a] hover:bg-[#d8b34a]/10'
              }`}
              title="Access the Administrator Race Fixture Management Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
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

      {/* Global Watch Sync Modal (for Dashboard target countdown & fixtures) */}
      {syncModalRace && (
        <WatchSyncModal
          raceName={syncModalRace.name}
          route={getEnrichedRaceRoute(
            syncModalRace.name,
            syncModalRace.city,
            syncModalRace.prov,
            syncModalRace.route,
            syncModalRace.dist[0],
            syncModalRace.discipline
          )}
          isOpen={true}
          onClose={() => setSyncModalRace(null)}
          defaultBrand="garmin"
        />
      )}
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
