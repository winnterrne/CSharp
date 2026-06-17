import api from "./axios";

export const aiApi = {
  getRecommendations: () => {
    return api.get("/ai/recommendations");
  },

  getDescription: (mediaId: number) => {
    return api.get(`/ai/description/${mediaId}`);
  },
};