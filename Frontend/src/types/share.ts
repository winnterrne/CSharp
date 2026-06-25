import type { Media } from "./media";
import type { Playlist } from "./playlist";
import type { User } from "./auth";

export type ShareTargetType = "media" | "playlist";

export interface Share {
  id: number;
  sharedBy: User;
  sharedWith?: User;
  targetType: ShareTargetType;
  media?: Media;
  playlist?: Playlist;
  message?: string;
  createdAt: string;
}

export interface ShareRequest {
  targetType: ShareTargetType;
  targetId: number;
  message?: string;
}