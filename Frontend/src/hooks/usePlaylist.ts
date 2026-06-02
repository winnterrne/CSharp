import { useEffect, useState } from "react";
import { playlistApi } from "../api/playlistApi";

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount?: number;
}

export const usePlaylist = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await playlistApi.getMyPlaylists();
      setPlaylists(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return {
    playlists,
    loading,
    error,
    refetch: fetchPlaylists,
  };
};