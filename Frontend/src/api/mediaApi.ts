import api from "./axios";

export const mediaApi = {
  getRecommended: () => api.get("/media/recommended"),
  getForYou:      () => api.get("/media/for-you"),
  getUpcoming:    () => api.get("/media/upcoming"),
  getById:        (id: string) => api.get(`/media/${id}`),
};