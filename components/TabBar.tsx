import React from 'react';
import { Tab } from '../types';
import { IconCalendar, IconUser, IconSunOutline } from './Icons';

interface TabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  // onQuickAdd removed from here as it moved to Timeline FAB
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onTabChange }) => {
  const getTabClass = (tab: Tab) => 
    `flex flex-col items-center justify-center gap-1 transition-colors h-full w-full ${currentTab === tab ? 'text-brand-600' : 'text-gray-400'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)] z-50 h-20 max-w-md mx-auto">
      <div className="grid grid-cols-3 h-full items-center px-6">
        
        {/* 1. Timeline Tab */}
        <button onClick={() => onTabChange(Tab.TIMELINE)} className={getTabClass(Tab.TIMELINE)}>
          <IconCalendar />
          <span className="text-[10px] font-medium">时光轴</span>
        </button>

        {/* 2. Planet Tab */}
        <button onClick={() => onTabChange(Tab.PLANET)} className={getTabClass(Tab.PLANET)}>
          <IconSunOutline />
          <span className="text-[10px] font-medium">温暖星球</span>
        </button>

        {/* 3. Profile/Stats Tab */}
        <button onClick={() => onTabChange(Tab.PROFILE)} className={getTabClass(Tab.PROFILE)}>
          <IconUser />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </div>
    </div>
  );
};