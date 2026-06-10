import { create } from "zustand";
import type { Media } from "../types/media";

interface MediaStore {
  // Recommended media
  recommended: Media[];
  setRecommended: (media: Media[]) => void;

  // For you media
  forYou: Media[];
  setForYou: (media: Media[]) => void;

  // Upcoming media
  upcoming: Media[];
  setUpcoming: (media: Media[]) => void;

  // Search results
  searchResults: Media[];
  searchQuery: string;
  setSearchResults: (results: Media[], query: string) => void;

  // Single media
  selectedMedia: Media | null;
  setSelectedMedia: (media: Media | null) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error
  error: string | null;
  setError: (error: string | null) => void;

  // Clear all
  clear: () => void;
}

export const mediaStore = create<MediaStore>((set) => ({
  recommended: [],
  setRecommended: (recommended) => set({ recommended }),

  forYou: [],
  setForYou: (forYou) => set({ forYou }),

  upcoming: [],
  setUpcoming: (upcoming) => set({ upcoming }),

  searchResults: [],
  searchQuery: "",
  setSearchResults: (searchResults, searchQuery) => set({ searchResults, searchQuery }),

  selectedMedia: null,
  setSelectedMedia: (selectedMedia) => set({ selectedMedia }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  clear: () =>
    set({
      recommended: [],
      forYou: [],
      upcoming: [],
      searchResults: [],
      searchQuery: "",
      selectedMedia: null,
      error: null,
    }),
}));