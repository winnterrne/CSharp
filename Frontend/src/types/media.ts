// types/media.ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  duration: number;
  color?: string;
  emoji?: string;
}