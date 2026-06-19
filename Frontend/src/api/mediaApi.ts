import api from "./axios";

export const mediaApi = {
  getMyMedia: () => api.get("/media/my-media"),

  getAll: () => api.get("/media/get-all"),

  getRecommended: () => api.get("/media/get-all"),
  getForYou: () => api.get("/media/get-all"),
  getUpcoming: () => api.get("/media/get-all"),

  getById: (id: number | string) => api.get(`/media/${id}`),

  search: (keyword: string) =>
    api.get("/media/get-all", {
      params: {
        keyWord: keyword,
        pageNumber: 1,
        pageSize: 20,
      },
    }),

  upload: (formData: FormData) =>
    api.post("/api/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getStreamUrl: (id: number | string) =>
    `http://localhost:5081/api/media/${id}/stream?t=${Date.now()}`,
};
