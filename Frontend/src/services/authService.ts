import { authApi } from "../api/authApi";
import type { User } from "../types/auth";

interface LoginResult {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: { email: string; password: string }): Promise<LoginResult> => {
    const res = await authApi.login(data.email, data.password);
    // Adjust these fields to match your actual BE response shape
    return {
      user: res.data.user,
      token: res.data.accessToken,
    };
  },

  register: async (data: { username: string; email: string; password: string }) => {
    const res = await authApi.register(data);
    return res.data;
  },

  logout: async () => {
    await authApi.logout();
  },

  refreshToken: async () => {
    const res = await authApi.refreshToken();
    return res.data;
  },
};