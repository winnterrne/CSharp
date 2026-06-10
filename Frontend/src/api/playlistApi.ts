import api from "./axios";
import type { CreatePlaylistRequest } from "../types/playlist";

export const playlistApi = {
  // BE: [Route("api/[controller]")] => /api/Playlist
  getMyPlaylists: () => api.get("/Playlist/my-playlist"),

  getById: (id: number) => api.get(`/Playlist/${id}`),

  create: (data: CreatePlaylistRequest) =>
    api.post("/Playlist", {
      playlistName: data.playlistName,
      description: data.description ?? "",
      isPublic: data.isPublic,
    }),

  delete: (id: number) => api.delete(`/Playlist/${id}`),

  addTrack: (playlistId: number, mediaItemId: number) =>
    api.post(`/Playlist/${playlistId}/tracks/${mediaItemId}`),

  removeTrack: (playlistId: number, mediaItemId: number) =>
    api.delete(`/Playlist/${playlistId}/tracks/${mediaItemId}`),
};
