import api from "./axios";

export const favoriteApi = {
  getFavorites: () => api.get("/Interaction/favorites"),

  addFavorite: (mediaItemId: number) =>
    api.post(`/Interaction/favorite/${mediaItemId}`),

  removeFavorite: (mediaItemId: number) =>
    api.delete(`/Interaction/favorite/${mediaItemId}`),
};