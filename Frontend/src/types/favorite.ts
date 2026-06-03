import type { Media } from "./media";
import type { Artist } from "./media";

export interface Favorite {
  id: number;
  media: Media;
  createdAt: string;
}

export interface FollowedArtist {
  id: number;
  artist: Artist;
  followedAt: string;
}