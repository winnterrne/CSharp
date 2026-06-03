import type { Media } from "./media";
import type { User } from "./auth";

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  owner: User;
  tracks: PlaylistTrack[];
  trackCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PlaylistTrack {
  id: number;
  media: Media;
  addedAt: string;
  order: number;
}

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
}

export interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
}