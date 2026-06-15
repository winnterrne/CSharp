import api from "./axios";

export const mediaApi = {
  getMyMedia: () => api.get("/media/my-media"),

  getAll: () => api.get("/media/get-all"),

  // Tạm thời 3 hàm này đều gọi get-all
  // Sau này có thể tách endpoint riêng
  getRecommended: () => api.get("/media/get-all"),
  getForYou: () => api.get("/media/get-all"),
  getUpcoming: () => api.get("/media/get-all"),
  

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

