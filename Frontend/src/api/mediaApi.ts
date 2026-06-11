import api from "./axios";

const API_BASE_URL = "http://localhost:5081/api";

export const mediaApi = {
  getMyMedia: () => api.get("/media/my-media"),

  // BE hiện chưa có GET /api/media.
  // Nếu sau này BE thêm endpoint này thì dùng được ngay.
  getAll: () => api.get("/media"),

  getById: (id: number | string) => api.get(`/media/${id}`),

  // BE hiện chưa thấy endpoint search.
  // Nếu BE thêm GET /api/media/search?keyword=... thì đổi lại dòng này.
  search: (keyword: string) =>
    api.get(`/media/search?keyword=${encodeURIComponent(keyword)}`),

  getStreamUrl: (id: number | string) =>
    `${API_BASE_URL}/media/${id}/stream`,
};