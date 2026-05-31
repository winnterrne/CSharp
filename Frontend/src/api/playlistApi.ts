import api from "./axios";

export const playlistApi = {
  getLibrary: () => api.get("/playlists/my"),
};