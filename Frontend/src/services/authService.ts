import api from "../api/axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};