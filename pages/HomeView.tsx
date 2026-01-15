import React, { useState, useEffect } from 'react';
import { IconRefresh, IconPlus } from '../components/Icons';
import { INSPIRATIONS } from '../types';

interface HomeViewProps {
  onOpenRecord: (initialText?: string) => void;
  streak: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenRecord, streak }) => {
  // Dynamic Background State
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [inspiration, setInspiration] = useState(INSPIRATIONS[0]);

  useEffect(() => {
    // 1. Determine Time of Day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    // 2. Random Inspiration
    setInspiration(INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)]);
  }, []);

  const changeInspiration = (e: React.MouseEvent) => {
    e.stopPropagation();
    let next = inspiration;
    while (next === inspiration) {
      next = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
    }
    setInspiration(next);
  };

  // Background Styles Map
  const bgStyles = {
    morning: "from-yellow-50 via-orange-50 to-blue-50",
    afternoon: "from-orange-100 via-amber-50 to-yellow-50",
    evening: "from-indigo-50 via-purple-50 to-pink-50",
    night: "from-slate-800 via-indigo-900 to-slate-900 text-white" // Dark mode handling
  };

  const isDark = timeOfDay === 'night';
  const textColor = isDark ? "text-white" : "text-gray-800";
  const mutedText = isDark ? "text-gray-300" : "text-gray-500";
  const cardBg = isDark ? "bg-white/10 border-white/10 text-white" : "bg-white/70 border-white/50 text-gray-800";

  return (
    <div className={`h-full flex flex-col items-center justify-center pb-32 px-6 relative overflow-hidden transition-colors duration-1000 bg-gradient-to-b ${bgStyles[timeOfDay]}`}>
      
      {/* Dynamic Header */}
      <div className="z-10 text-center mb-12 animate-fade-in">
        <h1 className={`text-3xl font-bold mb-2 tracking-tight ${textColor}`}>
          {timeOfDay === 'morning' && '早安，活着真好'}
          {timeOfDay === 'afternoon' && '午后，感受当下'}
          {timeOfDay === 'evening' && '日落，温柔时刻'}
          {timeOfDay === 'night' && '晚安，静谧时光'}
        </h1>
        <p className={`text-base ${mutedText}`}>
          {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {/* Inspiration Card (Action Trigger) */}
      <div 
        onClick={() => onOpenRecord(inspiration)}
        className={`w-full max-w-xs p-8 rounded-3xl shadow-xl backdrop-blur-md border cursor-pointer transform transition-all hover:scale-105 active:scale-95 group relative overflow-hidden ${cardBg}`}
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-400"></div>
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-brand-300' : 'text-brand-600'}`}>今日灵感</span>
          <button onClick={changeInspiration} className="p-1 rounded-full hover:bg-black/5 transition-colors">
            <IconRefresh />
          </button>
        </div>
        <p className="text-xl font-medium leading-relaxed pr-2">
          {inspiration}
        </p>
        <div className={`mt-6 flex items-center gap-2 text-sm font-bold ${isDark ? 'text-brand-300' : 'text-brand-600'} opacity-80 group-hover:opacity-100 transition-opacity`}>
          <IconPlus size={16} /> 点击记录这一刻
        </div>
      </div>

    </div>
  );
};