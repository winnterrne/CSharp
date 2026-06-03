export type MediaType = "audio" | "video";

export type MediaStatus = "published" | "upcoming" | "draft";

export interface Artist {
  id: number;
  name: string;
  avatarUrl?: string;
}

export interface Media {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  status: MediaStatus;
  url: string;
  thumbnailUrl?: string;
  duration: number; // seconds
  artist: Artist;
  genre?: string;
  releaseDate?: string;
  playCount?: number;
  createdAt: string;
}

export interface MediaSearchResult {
  items: Media[];
  total: number;
  query: string;
}