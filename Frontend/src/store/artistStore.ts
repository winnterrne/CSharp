import { create } from "zustand";

type ArtistRequest = {
  artistId: number;
  artistName: string;
  artistImage: string;
} | null;

type ArtistStore = {
  pendingArtist: ArtistRequest;
  setPendingArtist: (artist: ArtistRequest) => void;
};

export const useArtistStore = create<ArtistStore>((set) => ({
  pendingArtist: null,
  setPendingArtist: (artist) => set({ pendingArtist: artist }),
}));