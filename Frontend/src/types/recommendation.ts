import type { Media, MediaType } from "./media";
import { buildImageUrl } from "./media";


export interface RecommendationSong {
  mediaItemID: number;
  titleName?: string;
  artistName?: string;
  mediaItemImage?: string;
  filePath?: string;

  mediaItemTag?: string;      
  mediaItemType?: string;     
  duration?: number;          
  uploadAT?: string;          
}

export const mapRecommendationToMedia = (song: RecommendationSong): Media => {
  const type: MediaType =
    song.mediaItemType?.toLowerCase() === "video" ? "video" : "audio";

  return {
    id: String(song.mediaItemID),
    title: song.titleName ?? "Chưa có tên",
    description: "",
    type,
    status: "published",
    url: song.filePath
      ? `http://localhost:5081/media/${type}/${song.filePath}`
      : "",
    thumbnailUrl: buildImageUrl(song.mediaItemImage),
    duration: song.duration ?? 0,
    artist: {
      id: 0,
      name: song.artistName ?? "Không rõ nghệ sĩ",
    },
    genre: song.mediaItemTag ?? undefined,
    createdAt: song.uploadAT ?? new Date().toISOString(),
  };
};
