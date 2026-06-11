import api from "./axios";

export const playerApi = {
  getCurrentTrack: () => api.get("/player/current"),

  getQueue: () => api.get("/player/queue"),

  getHistory: () => api.get("/player/history"),

  getRecentlyPlayed: () => api.get("/player/recent"),

  saveHistory: (trackId: string) =>
    api.post("/player/history", {
      trackId,
    }),

  addToQueue: (trackId: string) =>
    api.post("/player/queue", {
      trackId,
    }),

  removeFromQueue: (trackId: string) => api.delete(`/player/queue/${trackId}`),
};
