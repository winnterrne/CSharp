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
  title?: string;

  mediaItemImage?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  coverUrl?: string;

  artistID?: number;
  artistId?: number;
  artistName?: string;
  ArtistName?: string;

  mediaItemTag?: string;
  MediaItemTag?: string;
  genre?: string;
  Genre?: string;
  category?: string;
  categoryName?: string;

  mediaItemType?: string;
  MediaItemType?: string;
  type?: string;

  duration?: number;
  Duration?: number;

  albumID?: number;
  albumId?: number;
  albumName?: string;

  uploadAT?: string;
  createdAt?: string;
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

const getTitleFromFavorite = (item: FavoriteMediaShape): string => {
  return item.titleName ?? item.title ?? "Bài hát yêu thích";
};

const getImageFromFavorite = (item: FavoriteMediaShape) => {
  return (
    item.mediaItemImage ??
    item.thumbnailUrl ??
    item.imageUrl ??
    item.coverUrl
  );
};

const getArtistNameFromFavorite = (item: FavoriteMediaShape): string => {
  return item.artistName ?? item.ArtistName ?? "Unknown Artist";
};

const getGenreFromFavorite = (item: FavoriteMediaShape): string | undefined => {
  return (
    item.mediaItemTag ??
    item.MediaItemTag ??
    item.genre ??
    item.Genre ??
    item.category ??
    item.categoryName ??
    undefined
  );
};

const getTypeFromFavorite = (item: FavoriteMediaShape): "audio" | "video" => {
  const rawType = item.mediaItemType ?? item.MediaItemType ?? item.type ?? "audio";

  return rawType.toLowerCase() === "video" ? "video" : "audio";
};

const getDurationFromFavorite = (item: FavoriteMediaShape): number => {
  return item.duration ?? item.Duration ?? 0;
};

const toMedia = (item: FavoriteMediaShape): Media => {
  const id = getIdFromFavorite(item);

  return {
    id,
    title: getTitleFromFavorite(item),
    description: "",
    type: getTypeFromFavorite(item),
    status: "published",
    url: `http://localhost:5081/api/media/${id}/stream`,
    thumbnailUrl: buildImageUrl(getImageFromFavorite(item)),
    duration: getDurationFromFavorite(item),
    artist: {
      id: item.artistID ?? item.artistId ?? 0,
      name: getArtistNameFromFavorite(item),
    },

    // FIX thể loại favorite bị Unknown
    genre: getGenreFromFavorite(item),

    albumId: item.albumID ?? item.albumId,
    albumName: item.albumName,
    createdAt: item.uploadAT ?? item.createdAt ?? new Date().toISOString(),
  };
};

const parseFavorites = (responseData: unknown) => {
  const body = responseData as FavoriteResponse | FavoriteMediaShape[];

  const rawData = Array.isArray(body)
    ? body
    : Array.isArray(body.data)
      ? body.data
      : [];

  console.log("FAVORITE RAW DATA:", rawData);

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

      console.log("FAVORITE API DATA:", res.data);

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
    void Promise.resolve().then(loadFavorites);

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