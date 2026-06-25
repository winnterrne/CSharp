import { create } from "zustand";
import type { Media } from "../types/media";
import { interactionApi } from "../api/interactionApi";

export interface HistoryItem extends Media {
  contextId?: string;
  playedAt: string;
}

interface HistoryState {
  recentTracks: HistoryItem[];
  addRecentTrack: (track: Media, contextId?: string) => void;
  clearHistory: () => void;
  loadHistoryFromServer: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  recentTracks: [],

  addRecentTrack: (track, contextId) => {
    interactionApi.recordPlayHistory(Number(track.id)).catch(() => {});
    set((state) => {
      const filtered = state.recentTracks.filter(
        (t) => String(t.id) !== String(track.id)
      );
      return {
        recentTracks: [
          { ...track, contextId, playedAt: new Date().toISOString() },
          ...filtered,
        ].slice(0, 50),
      };
    });
  },

  clearHistory: () => set({ recentTracks: [] }),

  loadHistoryFromServer: async () => {
    try {
      const res = await interactionApi.getPlayHistory(20);
      const items: any[] = res.data?.data ?? res.data ?? [];

      // Dedup theo mediaItemID
      const seen = new Set<number>();
      const unique = items.filter((item) => {
        if (seen.has(item.mediaItemID)) return false;
        seen.add(item.mediaItemID);
        return true;
      });

      const mapped: HistoryItem[] = unique.map((item) => ({
        id: String(item.mediaItemID),
        title: item.titleName ?? "Unknown",
        type: "audio" as const,
        status: "published" as const,
        url: `http://localhost:5081/api/media/${item.mediaItemID}/stream`,
        thumbnailUrl: item.mediaItemImage
          ? `http://localhost:5081/media/images/media/${item.mediaItemImage}`
          : undefined,
        duration: 0,
        artist: {
          id: 0,
          name: item.artistName ?? "Unknown Artist",
        },
        createdAt: item.playedAt,
        playedAt: item.playedAt,
      }));

      set({ recentTracks: mapped });
    } catch {
      // giữ nguyên state rỗng
    }
  },
}));