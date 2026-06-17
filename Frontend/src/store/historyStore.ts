import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Media } from "../types/media";

export interface HistoryItem extends Media {
  contextId?: string;
  playedAt: string;
}
interface HistoryState {
  recentTracks: HistoryItem[];

  addRecentTrack: (track: Media, contextId?: string) => void;

  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      recentTracks: [],

      addRecentTrack: (track, contextId) =>
        set((state) => {
          const filtered = state.recentTracks.filter(
            (t) => !(t.id === track.id && t.contextId === contextId)
          );

          return {
            recentTracks: [
              { ...track, contextId, playedAt: new Date().toISOString() },
              ...filtered,
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