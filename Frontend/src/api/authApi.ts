import api from "./axios";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/Auth/login", {
      email,
      password,
    }),

  register: (data: RegisterPayload) =>
    api.post("/Auth/register", {
      userName: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
    }),
};