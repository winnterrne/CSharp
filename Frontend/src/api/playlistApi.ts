import api from "./axios";

export const playlistApi = {
  getMyPlaylists: () =>
    api.get("/playlist/my"),

  getById: (id: number) =>
    api.get(`/playlist/${id}`),

  create: (data: {
    name: string;
    description?: string;
  }) =>
    api.post("/playlist", data),

  update: (
    id: number,
    data: {
      name?: string;
      description?: string;
    }
  ) =>
    api.put(`/playlist/${id}`, data),

  delete: (id: number) =>
    api.delete(`/playlist/${id}`),

  addTrack: (
    playlistId: number,
    trackId: number
  ) =>
    api.post(`/playlist/${playlistId}/tracks`, {
      trackId,
    }),

  removeTrack: (
    playlistId: number,
    trackId: number
  ) =>
    api.delete(
      `/playlist/${playlistId}/tracks/${trackId}`
    ),
};