// src/contexts/PlayerContext.tsx
import { createContext } from "react";
import type { Track } from "../types/media";

export interface PlayerContextType {
  // state
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;   // 0–100
  volume: number;     // 0–100
  shuffle: boolean;
  repeat: boolean;
  liked: boolean;
  // actions
  playTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  togglePlay: () => void;
  seek: (pct: number) => void;
  setVolume: (pct: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: () => void;
  prev: () => void;
  next: () => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);