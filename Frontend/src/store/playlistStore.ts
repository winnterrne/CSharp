import { create } from "zustand";
import type { Playlist, PlaylistTrack } from "../types/playlist";

interface PlaylistStore {
  myPlaylists: Playlist[];
  setMyPlaylists: (playlists: Playlist[]) => void;
  addPlaylist: (playlist: Playlist) => void;
  updatePlaylist: (id: number, playlist: Partial<Playlist>) => void;
  deletePlaylist: (id: number) => void;

  selectedPlaylist: Playlist | null;
  setSelectedPlaylist: (playlist: Playlist | null) => void;

  playlistTracks: PlaylistTrack[];
  setPlaylistTracks: (tracks: PlaylistTrack[]) => void;
  addTrackToPlaylist: (track: PlaylistTrack) => void;
  removeTrackFromPlaylist: (trackId: number) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  clear: () => void;
}

export const playlistStore = create<PlaylistStore>((set) => ({
  myPlaylists: [],
  selectedPlaylist: null,
  playlistTracks: [],
  isLoading: false,
  error: null,

  setMyPlaylists: (myPlaylists) => set({ myPlaylists }),

  addPlaylist: (playlist) =>
    set((state) => ({
      myPlaylists: [playlist, ...state.myPlaylists],
    })),

  updatePlaylist: (id, updates) =>
    set((state) => ({
      myPlaylists: state.myPlaylists.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
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
        state.selectedPlaylist?.id === id
          ? null
          : state.selectedPlaylist,
    })),

  setSelectedPlaylist: (selectedPlaylist) =>
    set({
      selectedPlaylist,
      playlistTracks: selectedPlaylist?.tracks ?? [],
    }),

  setPlaylistTracks: (playlistTracks) => set({ playlistTracks }),

  addTrackToPlaylist: (track) =>
    set((state) => {
      const existed = state.playlistTracks.some(
        (item) => item.id === track.id,
      );

      if (existed) return state;

      return {
        playlistTracks: [...state.playlistTracks, track],
        selectedPlaylist: state.selectedPlaylist
          ? {
              ...state.selectedPlaylist,
              tracks: [...state.selectedPlaylist.tracks, track],
              trackCount: state.selectedPlaylist.trackCount + 1,
            }
          : null,
      };
    }),

  removeTrackFromPlaylist: (trackId) =>
    set((state) => ({
      playlistTracks: state.playlistTracks.filter(
        (t) => t.id !== trackId,
      ),
      selectedPlaylist: state.selectedPlaylist
        ? {
            ...state.selectedPlaylist,
            tracks: state.selectedPlaylist.tracks.filter(
              (t) => t.id !== trackId,
            ),
            trackCount: Math.max(
              0,
              state.selectedPlaylist.trackCount - 1,
            ),
          }
        : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clear: () =>
    set({
      myPlaylists: [],
      selectedPlaylist: null,
      playlistTracks: [],
      isLoading: false,
      error: null,
    }),
}));