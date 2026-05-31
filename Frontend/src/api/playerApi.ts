import api from "./axios";

export const playerApi = {
  getQueue: () => api.get("/player/queue"),
  getArtists: (trackId: string) => api.get(`/tracks/${trackId}/artists`),
};
