import { create } from "zustand";
import type { Album } from "../types/album";

interface AlbumStore {
  selectedAlbumId: number | null;
  setSelectedAlbumId: (id: number | null) => void;
}

export const useAlbumStore = create<AlbumStore>((set) => ({
  selectedAlbumId: null,
  setSelectedAlbumId: (id) => set({ selectedAlbumId: id }),
}));