import api from "./axios";
import type { Album } from "../types/album";
import type { MediaAlbum } from "../types/mediaAlbum";

export const albumApi = {
  getAll: () =>
    api.get<{ data: Album[] }>("/Album/albums"),

  getTracks: (id: number) =>
  api.get<{ data: MediaAlbum[] }>(
    `/Album/${id}/tracks`
  ),
};