import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'gemini-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);