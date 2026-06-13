import { createContext } from "react";
import type { Track } from "../types/media";

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  setTrack: (track: Track) => void;
  togglePlay: () => void;
  setProgress: (v: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);