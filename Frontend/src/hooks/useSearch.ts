import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { mediaApi } from "../api/mediaApi";
import { mediaStore } from "../store/mediaStore";
import type { Media, MediaItemDto } from "../types/media";
import { mapMediaItemDtoToMedia } from "../types/media";

type MediaListResponse = {
  success?: boolean;
  data?: MediaItemDto[];
};

const normalize = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getMediaListFromResponse = (responseData: unknown): Media[] => {
  const body = responseData as MediaListResponse | MediaItemDto[];

  const rawData = Array.isArray(body)
    ? body
    : Array.isArray(body.data)
      ? body.data
      : [];

  return rawData.map(mapMediaItemDtoToMedia);
};

const filterMedia = (items: Media[], query: string) => {
  const key = normalize(query.trim());

  if (!key) return [];

  return items.filter((item) => {
    const title = normalize(item.title ?? "");
    const artist = normalize(item.artist?.name ?? "");
    const genre = normalize(item.genre ?? "");

    return title.includes(key) || artist.includes(key) || genre.includes(key);
  });
};

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const searchResults = mediaStore((state) => state.searchResults);
  const isLoading = mediaStore((state) => state.isLoading);
  const error = mediaStore((state) => state.error);

  const runSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      mediaStore.getState().setSearchResults([], "");
      return;
    }

    mediaStore.getState().setLoading(true);
    mediaStore.getState().setError(null);

    try {
      const res = await mediaApi.getAll();

      const allMedia = getMediaListFromResponse(res.data);
      const results = filterMedia(allMedia, searchQuery);

      mediaStore.getState().setSearchResults(results, searchQuery);
    } catch (err) {
      mediaStore
        .getState()
        .setError(err instanceof Error ? err.message : "Tìm kiếm thất bại");

      mediaStore.getState().setSearchResults([], searchQuery);
    } finally {
      mediaStore.getState().setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      mediaStore.getState().setSearchResults([], "");
      return;
    }

    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      runSearch(searchQuery);
    },
    [runSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    mediaStore.getState().setSearchResults([], "");
    mediaStore.getState().setError(null);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    searchResults,
    isLoading,
    error,
    search,
    clearSearch,
  };
};