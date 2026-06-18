import api from "./axios";
import type { CreatePlaylistDto } from "../types/playlist";

export interface PlaylistSearchResult {
  playlistID: number;
  playlistName: string;
  userID: string;
}

export interface PlaylistSearchResponse {
  success: boolean;
  message?: string;
  data: PlaylistSearchResult[];
  totalCount?: number;
  totalPages?: number;
}

export const playlistApi = {
  getMyPlaylists: () => api.get("/Playlist/my-playlist"),

  getById: (id: number) => api.get(`/Playlist/${id}`),

  create: (data: CreatePlaylistDto) =>
    api.post("/Playlist", {
      playlistName: data.PlaylistName,
      description: data.Description ?? "",
      isPublic: data.IsPublic,
    }),

  update: (
    id: number,
    data: {
      playlistID: number;
      playlistName?: string;
      description?: string;
      isPublic?: boolean;
    },
  ) => api.put(`/Playlist/${id}`, data),

  delete: (id: number) => api.delete(`/Playlist/${id}`),

  addTrack: (playlistId: number, mediaItemId: number) =>
    api.post(`/Playlist/${playlistId}/tracks/${mediaItemId}`),

  removeTrack: (playlistId: number, mediaItemId: number) =>
    api.delete(`/Playlist/${playlistId}/tracks/${mediaItemId}`),

  search: (keyword: string) =>
    api.get<PlaylistSearchResponse>("/Playlist/search", {
      params: {
        KeyWord: keyword,
        PageNumber: 1,
        PageSize: 10,
      },
    }),
};