import { create } from 'zustand';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheState {
  news: CacheItem<any[]> | null;
  courses: CacheItem<any[]> | null;
  weeklyClasses: CacheItem<any[]> | null;
  setNewsCache: (data: any[]) => void;
  setCoursesCache: (data: any[]) => void;
  setWeeklyClassesCache: (data: any[]) => void;
  invalidate: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCacheStore = create<CacheState>((set, get) => ({
  news: null,
  courses: null,
  weeklyClasses: null,

  setNewsCache: (data) => set({ news: { data, timestamp: Date.now() } }),
  setCoursesCache: (data) => set({ courses: { data, timestamp: Date.now() } }),
  setWeeklyClassesCache: (data) => set({ weeklyClasses: { data, timestamp: Date.now() } }),
  
  invalidate: () => set({ news: null, courses: null, weeklyClasses: null }),
}));

export const isCacheValid = (cache: CacheItem<any> | null): boolean => {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
};
