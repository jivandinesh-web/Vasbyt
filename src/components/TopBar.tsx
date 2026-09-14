import React, { useState, useEffect } from 'react';
import { Home, Map, Calendar, Users, User, Star } from 'lucide-react';
import { TabType } from '../types';

interface TopBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoriteCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  favoriteCount,
}) => {
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
                    ? 'bg-[#242c38] text-[#e28b37] border border-[#e28b37]/40 shadow-xs'
                    : 'text-[#9aa1ac] hover:text-[#f5efe3] hover:bg-[#1b212b] border border-transparent'
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

        {/* SAST Live Clock & Quick Info */}
        <div id="vasbyt-clock-wrapper" className="flex items-center gap-3">
          <div
            id="vasbyt-clock"
            className="text-right leading-tight font-mono tracking-tight"
          >
            <div className="text-[11px] text-[#6d7580] flex items-center justify-end gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7c8f5c] animate-pulse" />
              <span>{clockText.day}</span>
              <span className="hidden sm:inline text-[9px] text-[#6d7580] uppercase">SAST</span>
            </div>
            <div className="text-sm font-bold text-[#f5efe3]">{clockText.time}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

