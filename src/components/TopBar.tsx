import React, { useState, useEffect } from 'react';
import { Home, Map, Calendar, Users, User, Star, LogIn, HelpCircle, Sparkles } from 'lucide-react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { NeumorphicButton } from './NeumorphicButton';

interface TopBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoriteCount: number;
  onOpenHowTo: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  favoriteCount,
  onOpenHowTo,
}) => {
  const { user, openLoginModal, authLoading } = useAuth();

  const [clockText, setClockText] = useState<{ day: string; time: string }>({
    day: '',
    time: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to South African Standard Time (SAST, UTC+2)
      const day = now.toLocaleDateString('en-GB', {
        timeZone: 'Africa/Johannesburg',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      const time = now.toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Johannesburg',
        hour: '2-digit',
        minute: '2-digit',
      });
      setClockText({ day, time });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'provinces', label: 'Provinces', icon: <Map className="w-4 h-4" /> },
    { id: 'races', label: 'Race Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'clubs', label: 'Clubs', icon: <Users className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header
      id="vasbyt-topbar"
      className="sticky top-0 z-40 bg-[#12151b]/95 backdrop-blur-md border-b border-[#2c333f] py-3.5 px-4 sm:px-6 lg:px-8 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          id="vasbyt-brand"
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="flex items-baseline gap-2">
            <span
              id="vasbyt-brand-mark"
              className="font-display font-black text-3xl sm:text-4xl tracking-wider text-[#f5efe3] leading-none group-hover:text-white transition-colors"
            >
              VAS<span className="text-[#e28b37]">BYT</span>
            </span>
            <span
              id="vasbyt-brand-sub"
              className="hidden sm:inline text-xs tracking-widest text-[#6d7580] uppercase font-semibold"
            >
              SA Running
            </span>
          </div>
          <span className="hidden xl:inline-block text-[11px] text-[#7c8f5c] bg-[#7c8f5c]/10 border border-[#7c8f5c]/30 px-2 py-0.5 rounded-full font-medium">
            9 Provinces · Road &amp; Trail
          </span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xs text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'neu-inset-sm text-[#e28b37] border border-[#e28b37]/35 shadow-[inset_2px_2px_5px_#070a0e,inset_-1.5px_-1.5px_4px_#202837]'
                    : 'neu-btn text-[#9aa1ac] hover:text-[#f5efe3] border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'profile' && favoriteCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center text-[10px] bg-[#d8b34a]/20 text-[#d8b34a] border border-[#d8b34a]/40 px-1.5 py-0.2 rounded-full font-bold">
                    {favoriteCount}★
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Clock & Google Auth Status */}
        <div id="vasbyt-topbar-right" className="flex items-center gap-2 sm:gap-3">
          {/* Neumorphic How To Button */}
          <NeumorphicButton
            id="btn-topbar-howto"
            variant="default"
            size="sm"
            onClick={onOpenHowTo}
            title="How to use Vasbyt SA Running guide"
            leftIcon={<HelpCircle className="w-3.5 h-3.5 text-[#d8b34a]" />}
            className="text-[#d8b34a] hover:text-[#f5efe3] border-[#d8b34a]/30 hover:border-[#d8b34a]/60 text-xs tracking-wider uppercase font-bold"
          >
            How To
          </NeumorphicButton>

          {/* SAST Live Clock */}
          <div
            id="vasbyt-clock"
            className="hidden lg:block text-right leading-tight font-mono tracking-tight"
          >
            <div className="text-[11px] text-[#6d7580] flex items-center justify-end gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7c8f5c] animate-pulse" />
              <span>{clockText.day}</span>
              <span className="text-[9px] text-[#6d7580] uppercase">SAST</span>
            </div>
            <div className="text-sm font-bold text-[#f5efe3]">{clockText.time}</div>
          </div>

          {/* Neumorphic Profile Pill or Sign-In Button */}
          {user ? (
            <button
              id="topbar-user-pill"
              onClick={() => onTabChange('profile')}
              title={`Logged in as ${user.displayName || user.email} · View Profile`}
              className="neu-card-sm flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3 hover:border-[#e28b37]/50 transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google Profile'}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-[#e28b37]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#e28b37]/20 border border-[#e28b37] flex items-center justify-center text-[#e28b37] text-xs font-bold">
                  {(user.displayName || user.email || 'R').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-[#f5efe3] max-w-[90px] sm:max-w-[120px] truncate">
                {user.displayName?.split(' ')[0] || 'Runner'}
              </span>
            </button>
          ) : (
            <NeumorphicButton
              id="topbar-google-signin-btn"
              variant="primary"
              size="sm"
              onClick={openLoginModal}
              disabled={authLoading}
              title="Open Athlete Login & Registration Portal"
              leftIcon={
                <svg className="w-3.5 h-3.5 shrink-0 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" viewBox="0 0 24 24">
                  <path
                    fill="#1a0f02"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#1a0f02"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#1a0f02"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#1a0f02"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              }
              className="text-xs font-bold"
            >
              Sign In
            </NeumorphicButton>
          )}
        </div>
      </div>
    </header>
  );
};
