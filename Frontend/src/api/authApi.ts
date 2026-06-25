import api from "./axios";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/Auth/login", {
      email,
      password,
    }),

  register: (data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) =>
    api.post("/Auth/register", {
      userName: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
    }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};