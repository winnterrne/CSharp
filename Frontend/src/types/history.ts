import type { Media } from "./media";

export interface HistoryItem {
  id: number;
  media: Media;
  playedAt: string;
  playDuration?: number; // seconds actually listened
}