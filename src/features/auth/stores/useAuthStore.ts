import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  user: Nullable<User>;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    login: (userData) =>
      set((state) => {
        state.user = userData;
        state.isAuthenticated = true;
      }),
    logout: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      }),
  }))
);
