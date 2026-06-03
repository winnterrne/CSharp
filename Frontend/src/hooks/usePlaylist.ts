import { useCallback } from "react";
import { playlistStore } from "../store/playlistStore";
import type { Playlist, PlaylistTrack } from "../types/playlist";

export const usePlaylist = () => {
  const myPlaylists = playlistStore((state) => state.myPlaylists);
  const selectedPlaylist = playlistStore((state) => state.selectedPlaylist);
  const playlistTracks = playlistStore((state) => state.playlistTracks);
  const isLoading = playlistStore((state) => state.isLoading);
  const error = playlistStore((state) => state.error);

  const setMyPlaylists = useCallback((playlists: Playlist[]) => {
    playlistStore.getState().setMyPlaylists(playlists);
  }, []);

  const addPlaylist = useCallback((playlist: Playlist) => {
    playlistStore.getState().addPlaylist(playlist);
  }, []);

  const updatePlaylist = useCallback((id: number, playlist: Partial<Playlist>) => {
    playlistStore.getState().updatePlaylist(id, playlist);
  }, []);

  const deletePlaylist = useCallback((id: number) => {
    playlistStore.getState().deletePlaylist(id);
  }, []);

  const setSelectedPlaylist = useCallback((playlist: Playlist | null) => {
    playlistStore.getState().setSelectedPlaylist(playlist);
  }, []);

  const setPlaylistTracks = useCallback((tracks: PlaylistTrack[]) => {
    playlistStore.getState().setPlaylistTracks(tracks);
  }, []);

  const addTrackToPlaylist = useCallback((track: PlaylistTrack) => {
    playlistStore.getState().addTrackToPlaylist(track);
  }, []);

  const removeTrackFromPlaylist = useCallback((trackId: number) => {
    playlistStore.getState().removeTrackFromPlaylist(trackId);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    playlistStore.getState().setLoading(loading);
  }, []);

  const setError = useCallback((error: string | null) => {
    playlistStore.getState().setError(error);
  }, []);

  const clear = useCallback(() => {
    playlistStore.getState().clear();
  }, []);

  return {
    myPlaylists,
    selectedPlaylist,
    playlistTracks,
    isLoading,
    error,
    setMyPlaylists,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    setSelectedPlaylist,
    setPlaylistTracks,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    setLoading,
    setError,
    clear,
  };
};