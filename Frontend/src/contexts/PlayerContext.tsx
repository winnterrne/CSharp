import { createContext } from "react";
import type { Media } from "../types/media";
import type { RepeatMode } from "../types/player";

export interface PlayerContextType {
  // State
  currentTrack: Media | null;
  queue: Media[];
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
  volume: number; // 0–100
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLoading: boolean;

  playingContextId: string | null; 
  setPlayingContextId: (id: string | null) => void; 

  // Actions
  playTrack: (track: Media, queue?: Media[], contextId?: string) => void;
  setQueue: (tracks: Media[]) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  stopTrack: () => void;
  seek: (position: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: Media) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined,
);
