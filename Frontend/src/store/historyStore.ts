import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Media } from "../types/media";

interface HistoryState {
  recentTracks: Media[];

  addRecentTrack: (track: Media) => void;

  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      recentTracks: [],

      addRecentTrack: (track) =>
        set((state) => {
          const filtered = state.recentTracks.filter(
            (t) => t.id !== track.id
          );

          return {
            recentTracks: [
              { ...track, playedAt: new Date().toISOString() }, // ✅ lưu thời gian
              ...filtered
            ].slice(0, 50),
          };
        }),

      clearHistory: () =>
        set({
          recentTracks: [],
        }),
    }),
    {
      // KEY LOCAL STORAGE
      name: "tunevault-history",
    }
  )
);