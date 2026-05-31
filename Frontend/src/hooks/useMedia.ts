import { useState, useEffect } from "react";
import { mediaApi } from "../api/mediaApi";

interface MediaItem {
  id: number;
  title: string;
  color: string;
  emoji: string;
}

interface AlbumCard {
  id: number;
  title: string;
  artist: string;
  color: string;
  tag?: string;
}

export const useMedia = () => {
  const [recommended, setRecommended] = useState<MediaItem[]>([]);
  const [forYou, setForYou]           = useState<AlbumCard[]>([]);
  const [upcoming, setUpcoming]       = useState<AlbumCard[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [rec, fy, up] = await Promise.all([
          mediaApi.getRecommended(),
          mediaApi.getForYou(),
          mediaApi.getUpcoming(),
        ]);
        setRecommended(rec.data);
        setForYou(fy.data);
        setUpcoming(up.data);
      } catch {
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { recommended, forYou, upcoming, loading, error };
};