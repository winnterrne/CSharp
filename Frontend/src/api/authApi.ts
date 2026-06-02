import api from "./axios";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", {
      email,
      password,
    }),

  register: (data: {
    username: string;
    email: string;
    password: string;
  }) =>
    api.post("/auth/register", data),

  refreshToken: () =>
    api.post("/auth/refresh-token"),

  logout: () =>
    api.post("/auth/logout"),
};