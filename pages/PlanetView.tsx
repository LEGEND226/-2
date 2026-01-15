import React, { useState, useEffect } from 'react';
import { Moment } from '../types';
import { getPublicMoments } from '../utils/storage';
import { IconSun, IconSunOutline, IconUser } from '../components/Icons';

export const PlanetView: React.FC = () => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMoments(getPublicMoments());
  }, []);

  const handleSendSunshine = (id: string) => {
    if (likedIds.has(id)) return;
    setLikedIds(prev => new Set(prev).add(id));
    setMoments(prev => prev.map(m => 
      m.id === id ? { ...m, sunshineCount: (m.sunshineCount || 0) + 1 } : m
    ));
  };

  return (
    <div className="h-full bg-gray-50 px-4 pt-4 pb-24 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="bg-orange-100 p-2 rounded-full text-orange-500">
          <IconSunOutline />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">温暖星球</h2>
          <p className="text-xs text-gray-500">收集散落在世界各地的微光</p>
        </div>
      </div>

      <div className="grid gap-4">
        {moments.map(moment => (
          <div key={moment.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Ownership Badge */}
            {moment.isMine && (
               <div className="absolute top-0 right-0 bg-brand-100 text-brand-600 px-2 py-1 rounded-bl-lg text-[10px] font-bold">
                 我的
               </div>
            )}

            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-blue-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  {moment.isMine ? <IconUser size={14} /> : (moment.authorAlias || '匿').charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {moment.isMine ? '我' : (moment.authorAlias || '路过的微光')}
                </span>
              </div>
              <span className="text-xs text-gray-300">
                {new Date(moment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-800 text-base leading-relaxed mb-4">{moment.content}</p>

            {/* Planet Image Display */}
            {moment.images && moment.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {moment.images.map((img, idx) => (
                  <img key={idx} src={img} alt="planet-img" className="w-24 h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {moment.tags.map(tag => (
                  <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={() => handleSendSunshine(moment.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                  likedIds.has(moment.id) 
                    ? 'bg-brand-50 text-brand-600' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <IconSun filled={likedIds.has(moment.id)} />
                <span className="text-xs font-bold">{moment.sunshineCount || 0}</span>
                <span className="text-xs">{likedIds.has(moment.id) ? '已送出' : '送阳光'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-gray-300 text-xs mt-8 pb-8">
        已经到底啦，去创造你的微光吧
      </div>
    </div>
  );
};