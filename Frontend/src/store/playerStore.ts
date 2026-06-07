import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerState, RepeatMode } from "../types/player";
import type { Media } from "../types/media";
import { STORAGE_KEYS } from "../constant/storage";

interface PlayerStore extends PlayerState {
  // Actions
  setCurrentTrack: (track: Media | null) => void;
  setQueue: (queue: Media[]) => void;
  setPlaying: (playing: boolean) => void;
  setPosition: (position: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setLoading: (loading: boolean) => void;
  setDuration: (duration: number) => void; //them moi cho Playeraudio de hien thi thoi luong bai hat

  // Playback control helpers
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (position: number) => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;

  // Queue management
  addToQueue: (media: Media) => void;
  removeFromQueue: (mediaId: string) => void;
  clearQueue: () => void;

  // Clear all
  clear: () => void;
}

export const playerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      isPlaying: false,
      position: 0,
      duration: 0,
      volume: 75,
      isMuted: false,
      isShuffle: false,
      repeatMode: "off",
      isLoading: false,

      setCurrentTrack: (track) => set({ currentTrack: track }),
      setQueue: (queue) => set({ queue }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setPosition: (position) => set({ position }),
      setVolume: (volume) =>
        set({ volume: Math.max(0, Math.min(100, volume)) }),
      setDuration: (duration) => set({ duration }),
      setMuted: (isMuted) => set({ isMuted }),
      setShuffle: (isShuffle) => set({ isShuffle }),
      setRepeatMode: (repeatMode) => set({ repeatMode }),
      setLoading: (isLoading) => set({ isLoading }),

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      next: () => {
        const { currentTrack, queue, isShuffle, repeatMode } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIdx = queue.findIndex((m) => m.id === currentTrack.id);

        if (isShuffle) {
          const randomIdx = Math.floor(Math.random() * queue.length);
          set({ currentTrack: queue[randomIdx], position: 0 });
        } else if (currentIdx < queue.length - 1) {
          set({ currentTrack: queue[currentIdx + 1], position: 0 });
        } else if (repeatMode === "all") {
          set({ currentTrack: queue[0], position: 0 });
        }
      },

      previous: () => {
        const { currentTrack, queue } = get();
        if (!currentTrack || queue.length === 0) return;

        const currentIdx = queue.findIndex((m) => m.id === currentTrack.id);
        if (currentIdx > 0) {
          set({ currentTrack: queue[currentIdx - 1], position: 0 });
        }
      },

      seek: (position) => set({ position: Math.max(0, position) }),

      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

      toggleRepeatMode: () => {
        const { repeatMode } = get();
        const modes: RepeatMode[] = ["off", "one", "all"];
        const currentIdx = modes.indexOf(repeatMode);
        const nextMode = modes[(currentIdx + 1) % modes.length];
        set({ repeatMode: nextMode });
      },

      addToQueue: (media) =>
        set((state) => ({ queue: [...state.queue, media] })),

      removeFromQueue: (mediaId) =>
        set((state) => ({
          queue: state.queue.filter((m) => m.id !== mediaId),
        })),

      clearQueue: () => set({ queue: [] }),

      clear: () =>
        set({
          currentTrack: null,
          queue: [],
          isPlaying: false,
          position: 0,
          duration: 0,
          isLoading: false,
        }),
    }),

    {
      name: STORAGE_KEYS.VOLUME,
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        isShuffle: state.isShuffle,
        repeatMode: state.repeatMode,
      }),
    },
  ),
);
