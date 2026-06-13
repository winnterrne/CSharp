import { useCallback, useEffect, useState } from "react";
import { favoriteApi } from "../api/favoriteApi";
import type { Media } from "../types/media";
import { buildImageUrl } from "../types/media";
import { emitFavoriteUpdated } from "../utils/appEvents";
import { authStore } from "../store/authStore";

type FavoriteMediaShape = {
  mediaItemID?: number;
  mediaItemId?: number;
  id?: number;
  titleName?: string;
  mediaItemImage?: string;
};

type FavoriteResponse = {
  success?: boolean;
  data?: FavoriteMediaShape[];
};

let cachedFavoriteIds: string[] = [];
let cachedFavoriteTracks: Media[] = [];

const listeners = new Set<(ids: string[], tracks: Media[]) => void>();

const getIdFromFavorite = (item: FavoriteMediaShape): string => {
  return String(item.mediaItemID ?? item.mediaItemId ?? item.id ?? "");
};

const toMedia = (item: FavoriteMediaShape): Media => {
  const id = getIdFromFavorite(item);

  return {
    id,
    title: item.titleName ?? "Bài hát yêu thích",
    description: "",
    type: "audio",
    status: "published",
    url: `http://localhost:5081/api/media/${id}/stream`,
    thumbnailUrl: buildImageUrl(item.mediaItemImage),
    duration: 0,
    artist: {
      id: 0,
      name: "Unknown Artist",
    },
    createdAt: new Date().toISOString(),
  };
};

const parseFavorites = (responseData: unknown) => {
  const body = responseData as FavoriteResponse | FavoriteMediaShape[];

  const rawData = Array.isArray(body)
    ? body
    : Array.isArray(body.data)
      ? body.data
      : [];

  const validItems = rawData.filter(
    (item) => getIdFromFavorite(item).length > 0,
  );

  return {
    ids: validItems.map(getIdFromFavorite),
    tracks: validItems.map(toMedia),
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) =>
    listener(cachedFavoriteIds, cachedFavoriteTracks),
  );
};

export const useFavorite = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(cachedFavoriteIds);
  const [favoriteTracks, setFavoriteTracks] =
    useState<Media[]>(cachedFavoriteTracks);

  const [loading, setLoading] = useState(false);

  const syncFavorites = (ids: string[], tracks: Media[]) => {
    cachedFavoriteIds = ids;
    cachedFavoriteTracks = tracks;

    setFavoriteIds(ids);
    setFavoriteTracks(tracks);

    notifyListeners();
    emitFavoriteUpdated();
  };

  const loadFavorites = useCallback(async () => {
    try {
      const token = authStore.getState().token;

      if (!token) {
        syncFavorites([], []);
        return;
      }

      setLoading(true);

      const res = await favoriteApi.getFavorites();
      const parsed = parseFavorites(res.data);

      syncFavorites(parsed.ids, parsed.tracks);
    } catch (error) {
      console.error("LOAD FAVORITES ERROR:", error);
      syncFavorites([], []);
    } finally {
      setLoading(false);
    }
  }, []);

  const isFavorite = (mediaId: string | number) => {
    return favoriteIds.includes(String(mediaId));
  };

  const toggleFavorite = async (mediaId: string | number) => {
    const token = authStore.getState().token;

    if (!token) {
      alert("Bạn cần đăng nhập để thêm bài hát yêu thích");
      return;
    }

    const id = Number(mediaId);

    if (!id) return;

    try {
      if (cachedFavoriteIds.includes(String(id))) {
        await favoriteApi.removeFavorite(id);
      } else {
        await favoriteApi.addFavorite(id);
      }

      await loadFavorites();
    } catch (error) {
      console.error("TOGGLE FAVORITE ERROR:", error);
    }
  };

  useEffect(() => {
    const listener = (ids: string[], tracks: Media[]) => {
      setFavoriteIds(ids);
      setFavoriteTracks(tracks);
    };

    listeners.add(listener);
    loadFavorites();

    return () => {
      listeners.delete(listener);
    };
  }, [loadFavorites]);

  return {
    favoriteIds,
    favoriteTracks,
    loading,
    isFavorite,
    toggleFavorite,
    loadFavorites,
  };
};