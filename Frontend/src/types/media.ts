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
export interface MediaItemDto {
  mediaItemID: number;
  titleName?: string;
  filePath?: string;
  mediaItemImage?: string;
  mediaItemTag?: string;
  mediaItemType?: string;
  duration?: number;
  description?: string;
  artistID?: number;
  albumID?: number;
  userID?: string;
  uploadAT?: string;
}

export const mapMediaItemDtoToMedia = (item: MediaItemDto): Media => {
  const type: MediaType =
    item.mediaItemType?.toLowerCase() === "video" ? "video" : "audio";

  return {
    id: String(item.mediaItemID),
    title: item.titleName ?? "Chưa có tên",
    description: item.description ?? "",
    type,
    status: "published",
    url: `http://localhost:5081/api/media/${item.mediaItemID}/stream`,
    thumbnailUrl:
      item.mediaItemImage ?
        `http://localhost:5081/images/${item.mediaItemImage}`
      : undefined,
    duration: item.duration ?? 0,
    artist: {
      id: item.artistID ?? 0,
      name: "Unknown Artist",
    },
    genre: item.mediaItemTag ?? undefined,
    createdAt: item.uploadAT ?? new Date().toISOString(),
  };
};
