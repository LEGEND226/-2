import React from 'react';

export const GrowthTree: React.FC<{ streak: number }> = ({ streak }) => {
  let stage = 'seed';
  if (streak >= 3) stage = 'sprout';
  if (streak >= 8) stage = 'sapling';
  if (streak >= 21) stage = 'tree';

  return (
    <div className="relative w-48 h-48 flex items-center justify-center transition-all duration-1000">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-xl flex flex-col items-center justify-center p-4">
         {/* Simple SVG illustrations for growth stages */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md overflow-visible">
          {stage === 'seed' && (
            <g className="animate-pop">
              <circle cx="50" cy="80" r="6" fill="#8B4513" />
              <path d="M50 80 Q50 60 55 55" stroke="#4ADE80" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}
          {stage === 'sprout' && (
             <g className="animate-pop">
               <path d="M50 85 V60" stroke="#8B4513" strokeWidth="4" strokeLinecap="round"/>
               <path d="M50 60 Q30 40 35 30" fill="none" stroke="#4ADE80" strokeWidth="3" />
               <path d="M50 60 Q70 40 65 30" fill="none" stroke="#4ADE80" strokeWidth="3" />
               <ellipse cx="35" cy="30" rx="8" ry="4" fill="#4ADE80" transform="rotate(-30 35 30)" />
               <ellipse cx="65" cy="30" rx="8" ry="4" fill="#4ADE80" transform="rotate(30 65 30)" />
             </g>
          )}
          {stage === 'sapling' && (
            <g className="animate-pop">
               <path d="M50 90 V50" stroke="#8B4513" strokeWidth="5" strokeLinecap="round"/>
               <circle cx="50" cy="40" r="25" fill="#4ADE80" opacity="0.8" />
               <circle cx="65" cy="55" r="15" fill="#22C55E" opacity="0.8" />
               <circle cx="35" cy="55" r="15" fill="#22C55E" opacity="0.8" />
            </g>
          )}
          {stage === 'tree' && (
             <g className="animate-pop">
               <path d="M50 95 V50" stroke="#8B4513" strokeWidth="8" strokeLinecap="round"/>
               <circle cx="50" cy="45" r="35" fill="#22C55E" />
               <circle cx="75" cy="60" r="20" fill="#4ADE80" />
               <circle cx="25" cy="60" r="20" fill="#4ADE80" />
               <circle cx="50" cy="20" r="25" fill="#86EFAC" />
               {/* Flowers */}
               <circle cx="40" cy="30" r="4" fill="#FBBF24" className="animate-pulse" />
               <circle cx="70" cy="40" r="4" fill="#FBBF24" className="animate-pulse" style={{animationDelay: '0.5s'}} />
               <circle cx="30" cy="60" r="4" fill="#FBBF24" className="animate-pulse" style={{animationDelay: '1s'}} />
             </g>
          )}
        </svg>
        <div className="mt-2 text-center">
          <p className="text-xs font-bold text-gray-600">已连续 {streak} 天</p>
          <p className="text-[10px] text-gray-500">
            {stage === 'seed' ? '种子期' : stage === 'sprout' ? '萌芽期' : stage === 'sapling' ? '成长期' : '繁花期'}
          </p>
        </div>
      </div>
    </div>
  );
};