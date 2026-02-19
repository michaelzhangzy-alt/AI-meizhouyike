
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  initialize: async () => {
    try {
      // 1. 启动监听器
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, loading: false });
      });

      // 2. 获取初始 Session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      // 3. 更新状态 (如果监听器还没更新过)
      set((state) => {
        if (state.session) return state; // 监听器已经设置了 session，跳过
        return { session, user: session?.user ?? null, loading: false };
      });
      
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      // 4. 兜底：确保 loading 结束
      set((state) => ({ loading: false }));
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
