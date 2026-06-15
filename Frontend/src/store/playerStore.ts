import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerState, RepeatMode } from "../types/player";
import type { Media } from "../types/media";
import { STORAGE_KEYS } from "../constant/storage";

interface PlayerStore extends PlayerState {
  setCurrentTrack: (track: Media | null) => void;
  setQueue: (queue: Media[]) => void;
  setPlaying: (playing: boolean) => void;
  setPosition: (position: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setLoading: (loading: boolean) => void;
  setDuration: (duration: number) => void;

  playingContextId: string | null;
  setPlayingContextId: (id: string | null) => void;

  playTrack: (track: Media, queue?: Media[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (position: number) => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;

  addToQueue: (media: Media) => void;
  removeFromQueue: (mediaId: string) => void;
  clearQueue: () => void;
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
      playingContextId: null,

      setCurrentTrack: (track) =>
        set({
          currentTrack: track,
          position: 0,
        }),

      setQueue: (queue) => set({ queue }),

      setPlaying: (isPlaying) => set({ isPlaying }),

      setPosition: (position) =>
        set({
          position: Math.max(0, position),
        }),

      setVolume: (volume) =>
        set({
          volume: Math.max(0, Math.min(100, volume)),
        }),

      setMuted: (isMuted) => set({ isMuted }),

      setShuffle: (isShuffle) => set({ isShuffle }),

      setRepeatMode: (repeatMode) => set({ repeatMode }),

      setLoading: (isLoading) => set({ isLoading }),

      setDuration: (duration) =>
        set({
          duration: Math.max(0, duration),
        }),

      setPlayingContextId: (id) => set({ playingContextId: id }),

      playTrack: (track, queue) =>
        set((state) => ({
          currentTrack: track,
          queue: queue && queue.length > 0 ? queue : state.queue,
          isPlaying: true,
          position: 0,
        })),

      play: () => set({ isPlaying: true }),

      pause: () => set({ isPlaying: false }),

      togglePlay: () =>
        set((state) => ({
          isPlaying: !state.isPlaying,
        })),

      next: () => {
        const { currentTrack, queue, isShuffle, repeatMode } = get();

        if (!currentTrack || queue.length === 0) return;

        const currentIdx = queue.findIndex(
          (m) => m.id === currentTrack.id,
        );

        if (currentIdx === -1) return;

        if (isShuffle) {
          if (queue.length === 1) return;

          let randomIdx = currentIdx;

          while (randomIdx === currentIdx) {
            randomIdx = Math.floor(Math.random() * queue.length);
          }

          set({
            currentTrack: queue[randomIdx],
            isPlaying: true,
            position: 0,
          });

          return;
        }

        if (currentIdx < queue.length - 1) {
          set({
            currentTrack: queue[currentIdx + 1],
            isPlaying: true,
            position: 0,
          });

          return;
        }

        if (repeatMode === "all") {
          set({
            currentTrack: queue[0],
            isPlaying: true,
            position: 0,
          });
        }
      },

      previous: () => {
        const { currentTrack, queue, repeatMode } = get();

        if (!currentTrack || queue.length === 0) return;

        const currentIdx = queue.findIndex(
          (m) => m.id === currentTrack.id,
        );

        if (currentIdx === -1) return;

        if (currentIdx > 0) {
          set({
            currentTrack: queue[currentIdx - 1],
            isPlaying: true,
            position: 0,
          });

          return;
        }

        if (repeatMode === "all") {
          set({
            currentTrack: queue[queue.length - 1],
            isPlaying: true,
            position: 0,
          });
        }
      },

      seek: (position) =>
        set({
          position: Math.max(0, position),
        }),

      toggleShuffle: () =>
        set((state) => ({
          isShuffle: !state.isShuffle,
        })),

      toggleRepeatMode: () => {
        const { repeatMode } = get();
        const modes: RepeatMode[] = ["off", "one", "all"];
        const currentIdx = modes.indexOf(repeatMode);
        const nextMode = modes[(currentIdx + 1) % modes.length];

        set({
          repeatMode: nextMode,
        });
      },

      addToQueue: (media) =>
        set((state) => {
          const existed = state.queue.some(
            (item) => item.id === media.id,
          );

          if (existed) return state;

          return {
            queue: [...state.queue, media],
          };
        }),

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
          playingContextId: null,
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