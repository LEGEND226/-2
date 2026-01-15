import React, { useState, useEffect } from 'react';
import { UserStats, Moment, UserProfile } from '../types';
import { getStats, getMoments, deleteMoment, getUserProfile, saveUserProfile } from '../utils/storage';
import { IconUser, IconSun, IconChevronRight, IconLogOut, IconTrash, IconCalendar } from '../components/Icons';
import { GrowthTree } from '../components/GrowthTree';

interface ProfileViewProps {
  onRefreshNeeded: () => void; // Parent callback to trigger global refresh if needed
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onRefreshNeeded }) => {
  const [stats, setStats] = useState<UserStats>({ streakDays: 0, totalMoments: 0, totalSunshine: 0, lastRecordDate: '' });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'moments' | 'sunshine'>('moments');
  const [myMoments, setMyMoments] = useState<Moment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStats(getStats());
    setUser(getUserProfile());
    setMyMoments(getMoments());
  };

  const handleLogin = () => {
    // Simulate wx.getUserProfile
    const mockUser: UserProfile = {
      nickName: "热爱生活的你",
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
    };
    saveUserProfile(mockUser);
    setUser(mockUser);
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      localStorage.removeItem('alive_user');
      setUser(null);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (window.confirm('确定要删除这条记录吗？')) {
      const updated = deleteMoment(id);
      setMyMoments(updated);
      setStats(getStats());
      onRefreshNeeded(); // Tell parent app to refresh data
    }
  };

  const StatCard = ({ label, value, unit }: { label: string, value: number, unit: string }) => (
    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-brand-100 opacity-80">{label} ({unit})</div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col pb-24">
      {/* 1. Head Info Area */}
      <div className="bg-brand-500 pt-10 pb-6 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md overflow-hidden bg-brand-100">
             {user ? (
               <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
             ) : (
               <div 
                 onClick={handleLogin}
                 className="w-full h-full flex items-center justify-center text-brand-400 cursor-pointer hover:bg-brand-200 transition-colors"
               >
                 <IconUser />
               </div>
             )}
          </div>
          <div className="flex-1">
            {user ? (
              <div className="flex flex-col items-start">
                 <h2 className="text-xl font-bold text-white mb-1">{user.nickName}</h2>
                 <p className="text-xs text-brand-100 opacity-80">记录生活，治愈自己</p>
              </div>
            ) : (
              <button onClick={handleLogin} className="text-lg font-bold text-white flex items-center gap-2 hover:opacity-80 p-2 -ml-2 rounded-lg">
                点击登录 <IconChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 relative z-10">
          <StatCard label="连续" value={stats.streakDays} unit="天" />
          <StatCard label="瞬间" value={stats.totalMoments} unit="个" />
          <StatCard label="获赞" value={stats.totalSunshine} unit="次" />
        </div>
      </div>

      {/* 2. Growth Tree Section */}
      <div className="px-4 mt-6 mb-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
             <h3 className="text-lg font-bold text-gray-800">我的心流树</h3>
             <p className="text-xs text-gray-400 mt-1">伴随记录一起成长</p>
          </div>
          <div className="transform scale-75 origin-right -mr-6 -my-8">
            <GrowthTree streak={stats.streakDays} />
          </div>
        </div>
      </div>

      {/* 3. Content Management Area */}
      <div className="mt-4 px-4 flex-1 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 px-2 mb-4">
          <button 
            onClick={() => setActiveTab('moments')}
            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'moments' ? 'text-brand-600' : 'text-gray-400'}`}
          >
            我的瞬间
            {activeTab === 'moments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('sunshine')}
            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'sunshine' ? 'text-brand-600' : 'text-gray-400'}`}
          >
            收到的阳光
            {activeTab === 'sunshine' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"></div>}
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
          {activeTab === 'moments' ? (
            myMoments.length > 0 ? myMoments.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start group">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-gray-800 text-sm line-clamp-2 mb-2 break-words">{m.content}</p>
                  <div className="flex gap-2 text-xs text-gray-400 items-center">
                    <IconCalendar size={12} />
                    {new Date(m.createdAt).toLocaleDateString()}
                    {m.isPublic && <span className="text-brand-400 bg-brand-50 px-1.5 rounded ml-2 whitespace-nowrap">已公开</span>}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(m.id, e)} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  title="删除"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            )) : <div className="text-center text-gray-400 text-sm mt-10">暂无记录</div>
          ) : (
             // Mock Sunshine List
             myMoments.filter(m => (m.sunshineCount || 0) > 0).map(m => (
               <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                 <div className="bg-orange-100 text-orange-500 p-2 rounded-full">
                   <IconSun filled />
                 </div>
                 <div className="flex-1">
                   <p className="text-gray-800 text-sm font-medium">收到 {m.sunshineCount} 份阳光</p>
                   <p className="text-gray-400 text-xs mt-1 line-clamp-1">{m.content}</p>
                 </div>
               </div>
             ))
          )}
          {activeTab === 'sunshine' && myMoments.every(m => !m.sunshineCount) && (
            <div className="text-center text-gray-400 text-sm mt-10">还没有收到阳光哦</div>
          )}
        </div>
      </div>

      {/* Settings / Logout */}
      {user && (
         <div className="px-4 mt-2 mb-4">
            <button 
              onClick={handleLogout}
              className="w-full bg-white text-red-400 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-transform"
            >
              <IconLogOut size={16} /> 退出登录
            </button>
         </div>
      )}
    </div>
  );
};
