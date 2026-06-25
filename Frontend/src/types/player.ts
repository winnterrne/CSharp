import type { Media } from "./media";

export type RepeatMode = "off" | "one" | "all";

export interface PlayerState {
  currentTrack: Media | null;
  queue: Media[];
  isPlaying: boolean;
  position: number;   // seconds
  duration: number;   // seconds
  volume: number;     // 0–100
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLoading: boolean;
}

export interface PlayerCurrentResponse {
  track: Media;
  position: number;
  isPlaying: boolean;
}

