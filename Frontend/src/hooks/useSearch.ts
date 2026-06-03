import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { mediaApi } from "../api/mediaApi";
import { mediaStore } from "../store/mediaStore";
import type { Media } from "../types/media";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const searchResults = mediaStore((state) => state.searchResults);
  const isLoading = mediaStore((state) => state.isLoading);
  const error = mediaStore((state) => state.error);

  // Auto-search khi debouncedQuery thay đổi
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      mediaStore.getState().setSearchResults([], "");
      return;
    }
    runSearch(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const runSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    mediaStore.getState().setLoading(true);
    mediaStore.getState().setError(null);

    try {
      const res = await mediaApi.getSearch(searchQuery);
      const results: Media[] = Array.isArray(res.data)
        ? res.data
        : res.data?.items ?? [];
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