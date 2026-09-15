import React from 'react';
import { Home, Map, Calendar, Users, User, HelpCircle } from 'lucide-react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenHowTo?: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, onOpenHowTo }) => {
  const { user } = useAuth();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 transition-transform" strokeWidth={activeTab === 'home' ? 2.2 : 1.8} />,
    },
    {
      id: 'provinces',
      label: 'Provinces',
      icon: <Map className="w-5 h-5 transition-transform" strokeWidth={activeTab === 'provinces' ? 2.2 : 1.8} />,
    },
    {
      id: 'races',
      label: 'Races',
      icon: <Calendar className="w-5 h-5 transition-transform" strokeWidth={activeTab === 'races' ? 2.2 : 1.8} />,
    },
    {
      id: 'clubs',
      label: 'Clubs',
      icon: <Users className="w-5 h-5 transition-transform" strokeWidth={activeTab === 'clubs' ? 2.2 : 1.8} />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          referrerPolicy="no-referrer"
          className={`w-5 h-5 rounded-full object-cover border ${
            activeTab === 'profile' ? 'border-[#e28b37]' : 'border-transparent'
          }`}
        />
      ) : (
        <User className="w-5 h-5 transition-transform" strokeWidth={activeTab === 'profile' ? 2.2 : 1.8} />
      ),
    },
  ];

  return (
    <nav
      id="vasbyt-tabbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-[#12151b]/95 backdrop-blur-md border-t border-[#2c333f] pb-safe"
    >
      <div className="w-full max-w-lg flex px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 my-1 mx-0.5 rounded-xs cursor-pointer transition-all ${
                isActive
                  ? 'neu-inset-sm text-[#e28b37] border border-[#e28b37]/35'
                  : 'text-[#6d7580] hover:text-[#9aa1ac]'
              }`}
            >
              <div className={isActive ? 'drop-shadow-[0_0_8px_rgba(226,139,55,0.45)]' : ''}>
                {tab.icon}
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}

        {onOpenHowTo && (
          <button
            key="howto"
            id="tab-btn-howto"
            type="button"
            onClick={onOpenHowTo}
            title="How to use Vasbyt Guide"
            className="flex-1 flex flex-col items-center justify-center gap-1 pt-2.5 pb-2 cursor-pointer transition-colors bg-transparent border-none text-[#d8b34a] hover:text-[#f5efe3]"
          >
            <HelpCircle className="w-5 h-5 text-[#d8b34a]" strokeWidth={1.8} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#d8b34a]">
              How To
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
