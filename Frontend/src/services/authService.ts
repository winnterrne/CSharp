import { authApi } from "../api/authApi";
import type { User } from "../types/auth";

interface LoginResult {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResult> => {
    const res = await authApi.login(data.email, data.password);

    const loginData = res.data.data;

    return {
      user: {
        id: loginData.userID,
        username: loginData.userName,
        email: loginData.email,
        role: loginData.role,
      },
      token: loginData.token,
    };
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const res = await authApi.register(data);
    return res.data;
  },

  logout: async () => {
    authApi.logout();
  },
};