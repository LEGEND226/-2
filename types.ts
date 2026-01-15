export interface Moment {
  id: string;
  content: string;
  tags: string[];
  images?: string[]; // New: Stores URLs (Base64 for demo)
  createdAt: number; // Timestamp
  dayStr: string; // YYYY-MM-DD for easy grouping
  isPublic?: boolean; // New: Share to Warm Planet
  sunshineCount?: number; // New: Likes/Sunshine received
  authorAlias?: string; // New: Random alias for anonymity
  isMine?: boolean; // New: To identify user's own posts in Planet
}

export interface UserStats {
  streakDays: number;
  totalMoments: number;
  totalSunshine: number; // New
  lastRecordDate: string; // YYYY-MM-DD
}

export interface UserProfile {
  nickName: string;
  avatarUrl: string;
}

export enum Tab {
  RECORD = 'record',
  TIMELINE = 'timeline',
  PLANET = 'planet', // New Tab
  PROFILE = 'profile'
}

export const PRESET_TAGS = [
  '#小确幸',
  '#小成就',
  '#被爱着',
  '#好天气',
  '#美食',
  '#自律'
];

export const INSPIRATIONS = [
  "今天发生的哪件小事让你笑了？",
  "最近一次感受到风是什么时候？",
  "今天吃到的最美味的一口是什么？",
  "抬头看看天空，它是什么颜色的？",
  "今天有没有谁让你感到温暖？",
  "此刻你的身体感觉如何？",
  "为今天的自己写一句鼓励的话吧。"
];