import { Moment, UserStats, UserProfile } from '../types';

const MOMENTS_KEY = 'alive_moments';
const STATS_KEY = 'alive_stats';
const USER_KEY = 'alive_user';

// ----------------------------------------------------------------------------
// MOCK DATA FOR "WARM PLANET"
// ----------------------------------------------------------------------------
const MOCK_PUBLIC_MOMENTS: Moment[] = [
  { id: 'm1', content: '便利店的关东煮热气腾腾，冬天真的来了。', tags: ['#小确幸'], createdAt: Date.now() - 100000, dayStr: '2023-10-20', isPublic: true, sunshineCount: 12, authorAlias: '温暖的刺猬', isMine: false },
  { id: 'm2', content: '给流浪猫喂了火腿肠，它蹭了蹭我的裤脚。', tags: ['#被爱着'], createdAt: Date.now() - 500000, dayStr: '2023-10-19', isPublic: true, sunshineCount: 34, authorAlias: '透明的云', isMine: false },
  { id: 'm3', content: '终于把积压一周的报告写完了！奖励自己一杯奶茶。', tags: ['#小成就'], createdAt: Date.now() - 800000, dayStr: '2023-10-19', isPublic: true, sunshineCount: 8, authorAlias: '努力的蜗牛', isMine: false },
];

export const getMoments = (): Moment[] => {
  try {
    const data = localStorage.getItem(MOMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load moments', e);
    return [];
  }
};

export const getPublicMoments = (): Moment[] => {
  const localMoments = getMoments().filter(m => m.isPublic);
  // Mark local moments as mine
  const localWithFlag = localMoments.map(m => ({ ...m, isMine: true }));
  return [...localWithFlag, ...MOCK_PUBLIC_MOMENTS].sort((a, b) => b.createdAt - a.createdAt);
};

export const saveMoment = (moment: Moment): Moment[] => {
  const current = getMoments();
  // Ensure isMine is true for saved moments
  const newMoment = { ...moment, isMine: true };
  const updated = [newMoment, ...current];
  localStorage.setItem(MOMENTS_KEY, JSON.stringify(updated));
  updateStats(moment.dayStr);
  return updated;
};

// New function to update existing moment (e.g. toggle public)
export const updateMoment = (id: string, updates: Partial<Moment>): Moment[] => {
  const current = getMoments();
  const updated = current.map(m => m.id === id ? { ...m, ...updates } : m);
  localStorage.setItem(MOMENTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteMoment = (id: string): Moment[] => {
  const current = getMoments();
  const updated = current.filter(m => m.id !== id);
  localStorage.setItem(MOMENTS_KEY, JSON.stringify(updated));
  return updated;
};

export const getStats = (): UserStats => {
  try {
    const moments = getMoments();
    // Recalculate total sunshine dynamically
    const totalSunshine = moments.reduce((acc, m) => acc + (m.sunshineCount || 0), 0);
    
    const data = localStorage.getItem(STATS_KEY);
    const stats = data ? JSON.parse(data) : { streakDays: 0, totalMoments: 0, lastRecordDate: '' };
    
    return {
      ...stats,
      totalMoments: moments.length,
      totalSunshine
    };
  } catch (e) {
    return { streakDays: 0, totalMoments: 0, totalSunshine: 0, lastRecordDate: '' };
  }
};

const updateStats = (todayStr: string) => {
  const stats = getStats();
  
  let newStreak = stats.streakDays;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (stats.lastRecordDate === yesterdayStr) {
    newStreak += 1;
  } else if (stats.lastRecordDate !== todayStr) {
    newStreak = 1;
  }

  const newStats: UserStats = {
    streakDays: stats.lastRecordDate === todayStr ? stats.streakDays : newStreak,
    totalMoments: stats.totalMoments + 1, // Will be overwritten by getStats but good for atomic update logic
    totalSunshine: stats.totalSunshine,
    lastRecordDate: todayStr
  };
  
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
};

export const clearAll = () => {
  localStorage.removeItem(MOMENTS_KEY);
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(USER_KEY);
};