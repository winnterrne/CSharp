import api from "./axios";

export interface UpdateProfilePayload {
  userName?: string;
  userImage?: string;
  phone?: string;
  bio?: string;
}

export const userApi = {
  getProfile: (userId: string) => api.get(`/User/${userId}`),

  updateProfile: (userId: string, data: UpdateProfilePayload) =>
    api.put(`/User/${userId}`, data),
};