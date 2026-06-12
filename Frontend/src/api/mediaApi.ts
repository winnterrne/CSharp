import api from "./axios";

export const mediaApi = {
  getMyMedia: () => api.get("/media/my-media"),
getAll: () => api.get("/media/get-all"),
  getById: (id: number | string) => api.get(`/media/${id}`),

  getStreamUrl: (id: number | string) =>
    `http://localhost:5081/api/media/${id}/stream`,
};