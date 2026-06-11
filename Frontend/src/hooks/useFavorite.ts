import { useCallback, useEffect, useState } from "react";
import { favoriteApi } from "../api/favoriteApi";

type FavoriteMediaShape = {
  mediaItemID?: number;
  mediaItemId?: number;
  id?: number;
  media?: {
    id?: string | number;
    mediaItemID?: number;
    mediaItemId?: number;
  };
};

type FavoriteResponse = {
  success?: boolean;
  data?: FavoriteMediaShape[];
};

let cachedFavoriteIds: string[] = [];
const listeners = new Set<(ids: string[]) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(cachedFavoriteIds));
};

const getIdFromFavorite = (item: FavoriteMediaShape): string => {
  return String(
    item.mediaItemID ??
      item.mediaItemId ??
      item.id ??
      item.media?.id ??
      item.media?.mediaItemID ??
      item.media?.mediaItemId ??
      ""
  );
};

const parseFavoriteIds = (responseData: unknown): string[] => {
  const body = responseData as FavoriteResponse | FavoriteMediaShape[];

  const rawData = Array.isArray(body)
    ? body
    : Array.isArray(body.data)
      ? body.data
      : [];

  return rawData
    .map(getIdFromFavorite)
    .filter((id) => id.length > 0);
};

export const useFavorite = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(cachedFavoriteIds);
  const [loading, setLoading] = useState(false);

  const syncFavoriteIds = (ids: string[]) => {
    cachedFavoriteIds = ids;
    setFavoriteIds(ids);
    notifyListeners();
  };

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);

      const res = await favoriteApi.getFavorites();
      const ids = parseFavoriteIds(res.data);

      syncFavoriteIds(ids);
    } catch (error) {
      console.error("LOAD FAVORITES ERROR:", error);
      syncFavoriteIds([]);
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

    const idText = String(id);
    const existed = cachedFavoriteIds.includes(idText);

    const nextIds = existed
      ? cachedFavoriteIds.filter((item) => item !== idText)
      : [idText, ...cachedFavoriteIds];

    syncFavoriteIds(nextIds);

    try {
      if (existed) {
        await favoriteApi.removeFavorite(id);
      } else {
        await favoriteApi.addFavorite(id);
      }
    } catch (error) {
      console.error("TOGGLE FAVORITE ERROR:", error);

      syncFavoriteIds(cachedFavoriteIds);
    }
  };

  useEffect(() => {
    const listener = (ids: string[]) => {
      setFavoriteIds(ids);
    };

    listeners.add(listener);

    if (cachedFavoriteIds.length === 0) {
      loadFavorites();
    }

    return () => {
      listeners.delete(listener);
    };
  }, [loadFavorites]);

  return {
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    loadFavorites,
  };
};