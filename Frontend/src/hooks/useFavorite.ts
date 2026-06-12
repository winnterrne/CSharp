import { useCallback, useEffect, useState } from "react";
import { favoriteApi } from "../api/favoriteApi";

const getIdFromFavorite = (item: unknown): string => {
  const data = item as {
    mediaItemID?: number;
    mediaItemId?: number;
    id?: number;
    media?: {
      id?: string;
      mediaItemID?: number;
    };
  };

  return String(
    data.mediaItemID ??
      data.mediaItemId ??
      data.id ??
      data.media?.id ??
      data.media?.mediaItemID ??
      ""
  );
};

export const useFavorite = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);

      const res = await favoriteApi.getFavorites();

      const rawData = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? [];

      const ids = rawData
        .map(getIdFromFavorite)
        .filter((id: string) => id.length > 0);

      setFavoriteIds(ids);
    } catch (err) {
      console.error("LOAD FAVORITES ERROR:", err);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const isFavorite = (mediaId: string | number) => {
    return favoriteIds.includes(String(mediaId));
  };

  const toggleFavorite = async (mediaId: string | number) => {
    const id = Number(mediaId);
    if (!id) return;

    const existed = isFavorite(id);

    try {
      if (existed) {
        await favoriteApi.removeFavorite(id);
        setFavoriteIds((prev) => prev.filter((item) => item !== String(id)));
      } else {
        await favoriteApi.addFavorite(id);
        setFavoriteIds((prev) => [String(id), ...prev]);
      }
    } catch (err) {
      console.error("TOGGLE FAVORITE ERROR:", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    loadFavorites,
  };
};