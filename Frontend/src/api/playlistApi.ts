import api from "./axios";
import type { CreatePlaylistDto } from "../types/playlist";

export const playlistApi = {
  // BE: [Route("api/[controller]")] => /api/Playlist
  getMyPlaylists: () => api.get("/Playlist/my-playlist"),

  getById: (id: number) => api.get(`/Playlist/${id}`),

  create: (data: CreatePlaylistDto) =>
    api.post("/Playlist", {
      playlistName: data.PlaylistName,
      description: data.Description ?? "",
      isPublic: data.IsPublic,
    }),

  delete: (id: number) => api.delete(`/Playlist/${id}`),

  addTrack: (playlistId: number, mediaItemId: number) =>
    api.post(`/Playlist/${playlistId}/tracks/${mediaItemId}`),

  removeTrack: (playlistId: number, mediaItemId: number) =>
    api.delete(`/Playlist/${playlistId}/tracks/${mediaItemId}`),
};

