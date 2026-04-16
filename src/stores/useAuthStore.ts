import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: 'customer' | 'admin' | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  initialize: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      set({ session, user: session.user });
      // Fetch role
      const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single();
      if (data) {
        set({ role: data.role });
      }
    }
    
    set({ isInitialized: true });

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single();
        if (data) {
          set({ role: data.role });
        }
      } else {
        set({ role: null });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null });
  }
}));
