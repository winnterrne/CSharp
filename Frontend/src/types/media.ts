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
  playedAt?: string;
  playlistId?: number;
  playlistName?: string;
  albumId?: number;
  albumName?: string;
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
  artistName?: string;
  albumID?: number;
  albumName?: string;
  userID?: string;
  uploadAT?: string;
}

export interface MediaItemAlbumDto {
  mediaItemID: number;
  titleName: string;
  filePath: string;
  mediaItemImage: string;
  duration: number;
  mediaItemTag?: string;
}

export const buildImageUrl = (img?: string) => {
  if (!img) return undefined;
  // absolute URL
  if (img.startsWith("http")) return img;
  // already a rooted path e.g. /media/...
  if (img.startsWith("/")) return `http://localhost:5081${img}`;
  // contains folder segments (images or media) — prefix host
  if (img.includes("/")) return `http://localhost:5081/${img}`;
  // bare filename from seed data — images live under /media/images/media/
  return `http://localhost:5081/media/images/media/${img}`;
};

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
    thumbnailUrl: buildImageUrl(item.mediaItemImage),
    duration: item.duration ?? 0,
    artist: {
      id: item.artistID ?? 0,
      name: item.artistName ?? "Unknown Artist",
    },
    genre: item.mediaItemTag ?? undefined,
    createdAt: item.uploadAT ?? new Date().toISOString(),
  };
};

export const mapAlbumTrackToMedia = (
  item: MediaItemAlbumDto,
  albumId?: number,
  albumName?: string,
  artistName?: string,
): Media => {
  return {
    id: String(item.mediaItemID),
    title: item.titleName,
    type: "audio",
    status: "published",

    url: `http://localhost:5081/api/media/${item.mediaItemID}/stream`,

    thumbnailUrl: buildImageUrl(item.mediaItemImage),

    duration: item.duration,

    artist: {
      id: 0,
      name: artistName ?? "Unknown Artist",
    },
    genre: item.mediaItemTag ?? undefined,
    albumId,
    albumName,

    createdAt: new Date().toISOString(),
  };
};
