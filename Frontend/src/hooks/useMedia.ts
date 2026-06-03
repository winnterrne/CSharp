import { useCallback } from "react";
import { mediaStore } from "../store/mediaStore";
import type { Media } from "../types/media";

export const useMedia = () => {
  const recommended = mediaStore((state) => state.recommended);
  const forYou = mediaStore((state) => state.forYou);
  const upcoming = mediaStore((state) => state.upcoming);
  const searchResults = mediaStore((state) => state.searchResults);
  const searchQuery = mediaStore((state) => state.searchQuery);
  const selectedMedia = mediaStore((state) => state.selectedMedia);
  const isLoading = mediaStore((state) => state.isLoading);
  const error = mediaStore((state) => state.error);

  const setRecommended = useCallback((media: Media[]) => {
    mediaStore.getState().setRecommended(media);
  }, []);

  const setForYou = useCallback((media: Media[]) => {
    mediaStore.getState().setForYou(media);
  }, []);

  const setUpcoming = useCallback((media: Media[]) => {
    mediaStore.getState().setUpcoming(media);
  }, []);

  const setSearchResults = useCallback((results: Media[], query: string) => {
    mediaStore.getState().setSearchResults(results, query);
  }, []);

  const setSelectedMedia = useCallback((media: Media | null) => {
    mediaStore.getState().setSelectedMedia(media);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    mediaStore.getState().setLoading(loading);
  }, []);

  const setError = useCallback((error: string | null) => {
    mediaStore.getState().setError(error);
  }, []);

  const clear = useCallback(() => {
    mediaStore.getState().clear();
  }, []);

  return {
    recommended,
    forYou,
    upcoming,
    searchResults,
    searchQuery,
    selectedMedia,
    isLoading,
    error,
    setRecommended,
    setForYou,
    setUpcoming,
    setSearchResults,
    setSelectedMedia,
    setLoading,
    setError,
    clear,
  };
};