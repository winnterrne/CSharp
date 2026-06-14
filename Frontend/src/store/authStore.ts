import { create } from "zustand";
import type { User, AuthState } from "../types/auth";

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  getUser: () => User | null;
  getToken: () => string | null;
  clear: () => void;
}

export const authStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) =>
  set({
    user: user
      ? {
          ...user,
          avatarUrl: user.userImage
            ? `http://localhost:5081/media/images/users/${user.userImage}`
            : undefined,
        }
      : null,
    isAuthenticated: !!user && !!get().token,
  }),

  setToken: (token) =>
    set({
      token,
      isAuthenticated: !!token && !!get().user,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (user, token) =>
  set({
    user: {
      ...user,
      avatarUrl: user.userImage
        ? `http://localhost:5081/media/images/users/${user.userImage}`
        : undefined,
    },
    token,
    isAuthenticated: true,
    isLoading: false,
  }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  getUser: () => get().user,

  getToken: () => get().token,

  clear: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
