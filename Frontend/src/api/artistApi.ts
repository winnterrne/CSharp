import api from "./axios";

export const artistApi = {
  getProfile: (artistId: number) =>
    api.get(`/artist/${artistId}/profile`),
};