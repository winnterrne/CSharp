import api from "./axios";

export const playlistApi = {
  // GET /api/Playlist/my-playlist
  getMyPlaylists: () => api.get("/Playlist/my-playlist"),

  // GET /api/Playlist/{id}
  getById: (id: number) => api.get(`/Playlist/${id}`),

  // POST /api/Playlist
  create: (data: {
    playlistName: string;
    description?: string;
    isPublic: boolean;
  }) => api.post("/Playlist", data),

  // DELETE /api/Playlist/{id}
  delete: (id: number) => api.delete(`/Playlist/${id}`),

  // POST /api/Playlist/{playlistId}/tracks/{mediaItemId}
  addTrack: (playlistId: number, mediaItemId: number) =>
    api.post(`/Playlist/${playlistId}/tracks/${mediaItemId}`),

  // DELETE /api/Playlist/{playlistId}/tracks/{mediaItemId}
  removeTrack: (playlistId: number, mediaItemId: number) =>
    api.delete(`/Playlist/${playlistId}/tracks/${mediaItemId}`),
};