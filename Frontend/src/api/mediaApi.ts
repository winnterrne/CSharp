import api from "./axios";

const API_BASE_URL = "http://localhost:5081/api";

export const mediaApi = {
  getMyMedia: () => api.get("/media/my-media"),

  getAll: () => api.get("/media/all"),

  getById: (id: number | string) => api.get(`/media/${id}`),

  search: (keyword: string) =>
    api.get("/media", {
      params: {
        keyWord: keyword,
        pageNumber: 1,
        pageSize: 20,
      },
    }),

 getStreamUrl: (id: number | string) =>
  `http://localhost:5081/api/media/${id}/stream?t=${Date.now()}`,};