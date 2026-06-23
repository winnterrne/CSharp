import { create } from "zustand";
import type { User, AuthState } from "../types/auth";
import { useHistoryStore } from "./historyStore";

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
    set((state) => {
      if (!user) {
        return { user: null, isAuthenticated: false };
      }

      // Hòa trộn dữ liệu cũ đang có trong store (state.user) với dữ liệu mới (user)
      // để tránh việc F5 hoặc nạp thiếu trường làm mất bio, phone
      const updatedUser = {
        ...(state.user || {}),
        ...user,
        avatarUrl: user.userImage
          ? `http://localhost:5081/media/images/users/${user.userImage}`
          : (user.avatarUrl || (state.user?.avatarUrl)), // Giữ lại avatarUrl cũ nếu không có userImage mới
      };

      return {
        user: updatedUser,
        isAuthenticated: !!get().token || !!sessionStorage.getItem("token") || !!localStorage.getItem("token"), // Linh hoạt theo cơ chế lưu token của bạn
      };
    }),

  setToken: (token) =>
    set({
      token,
      isAuthenticated: !!token && !!get().user,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (user, token) => {
    useHistoryStore.getState().clearHistory();
    const hasValidImage = user.userImage && user.userImage .trim() != "";

    set({
      user: {
        ...user,
        avatarUrl: hasValidImage
          ? `http://localhost:5081/media/images/users/${user.userImage}`
          : undefined,
      },
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    useHistoryStore.getState().clearHistory();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

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