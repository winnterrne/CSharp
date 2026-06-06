import api from "./axios";

export const mediaApi = {
  getRecommended: () => api.get("/media/recommended"),

  getForYou: () => api.get("/media/for-you"),

  getUpcoming: () => api.get("/media/upcoming"),

  getById: (id: string) => api.get(`/media/${id}`),
  getMyMedia: () => api.get("/media/my-media"),
  getStreamUrl: (id: number | string) => `/media/${id}/stream`,

  getSearch: (query: string) =>
    api.get(`/media/search?q=${encodeURIComponent(query)}`),
  getRecentlyPlayed: () => api.get("/media/recently-played"),
};
