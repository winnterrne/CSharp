import api from "./axios";

export interface UpdateProfilePayload {
  userName?: string;
  userImage?: string;
  phone?: string;
  bio?: string;
}

export interface UserSearchResult {
  userID: string;
  userName: string;
  userImage: string | null;
  email: string;
  role: string;
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const userApi = {
  getProfile: (userId: string) => api.get(`/User/${userId}`),

  updateProfile: (userId: string, data: UpdateProfilePayload) =>
    api.put(`/User/${userId}`, data),

  search: (keyword: string) =>
    api.get<ApiResponse<UserSearchResult[]>>("/User", {
      params: {
        Keyword: keyword,
        PageNumber: 1,
        PageSize: 10,
      },
    }),
};