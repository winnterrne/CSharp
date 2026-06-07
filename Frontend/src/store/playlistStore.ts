import { create } from "zustand";
import type { Playlist, PlaylistTrack } from "../types/playlist";

interface PlaylistStore {
  // My playlists
  myPlaylists: Playlist[];
  setMyPlaylists: (playlists: Playlist[]) => void;
  addPlaylist: (playlist: Playlist) => void;
  updatePlaylist: (id: number, playlist: Partial<Playlist>) => void;
  deletePlaylist: (id: number) => void;

  // Selected playlist
  selectedPlaylist: Playlist | null;
  setSelectedPlaylist: (playlist: Playlist | null) => void;

  // Playlist tracks
  playlistTracks: PlaylistTrack[];
  setPlaylistTracks: (tracks: PlaylistTrack[]) => void;
  addTrackToPlaylist: (track: PlaylistTrack) => void;
  removeTrackFromPlaylist: (trackId: number) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error
  error: string | null;
  setError: (error: string | null) => void;

  // Clear all
  clear: () => void;
}

export const playlistStore = create<PlaylistStore>((set) => ({
  myPlaylists: [],
  setMyPlaylists: (myPlaylists) => set({ myPlaylists }),
  addPlaylist: (playlist) =>
    set((state) => ({ myPlaylists: [...state.myPlaylists, playlist] })),
  updatePlaylist: (id, updates) =>
    set((state) => ({
      myPlaylists: state.myPlaylists.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      selectedPlaylist:
        state.selectedPlaylist?.id === id
          ? { ...state.selectedPlaylist, ...updates }
          : state.selectedPlaylist,
    })),
  deletePlaylist: (id) =>
    set((state) => ({
      myPlaylists: state.myPlaylists.filter((p) => p.id !== id),
      selectedPlaylist:
        state.selectedPlaylist?.id === id ? null : state.selectedPlaylist,
    })),

  selectedPlaylist: null,
  setSelectedPlaylist: (selectedPlaylist) => set({ selectedPlaylist }),

  playlistTracks: [],
  setPlaylistTracks: (playlistTracks) => set({ playlistTracks }),
  addTrackToPlaylist: (track) =>
    set((state) => ({
      playlistTracks: [...state.playlistTracks, track],
      selectedPlaylist: state.selectedPlaylist
        ? {
            ...state.selectedPlaylist,
            trackCount: state.selectedPlaylist.trackCount + 1,
          }
        : null,
    })),
  removeTrackFromPlaylist: (trackId) =>
    set((state) => ({
      playlistTracks: state.playlistTracks.filter((t) => t.id !== trackId),
      selectedPlaylist: state.selectedPlaylist
        ? {
            ...state.selectedPlaylist,
            trackCount: Math.max(0, state.selectedPlaylist.trackCount - 1),
          }
        : null,
    })),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  clear: () =>
    set({
      myPlaylists: [],
      selectedPlaylist: null,
      playlistTracks: [],
      error: null,
    }),
}));