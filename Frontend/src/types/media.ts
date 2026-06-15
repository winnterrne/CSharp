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
  duration: number;
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
  mediaItemID?: number;
  mediaItemId?: number;
  id?: number;

  titleName?: string;
  title?: string;

  filePath?: string;

  mediaItemImage?: string;
  image?: string;
  coverUrl?: string;

  mediaItemTag?: string;
  genre?: string;

  mediaItemType?: string;
  type?: string;

  duration?: number;
  description?: string;

  artistID?: number;
  artistId?: number;
  artistName?: string;

  albumID?: number;
  albumId?: number;
  albumName?: string;

  playlistID?: number;
  playlistId?: number;
  playlistName?: string;

  userID?: string;
  uploadAT?: string;
  createdAt?: string;
}

const API_HOST = "http://localhost:5081";

export const buildImageUrl = (img?: string): string | undefined => {
  if (!img) return undefined;

  if (img.startsWith("http")) return img;

  if (img.startsWith("/")) {
    return `${API_HOST}${img}`;
  }

  if (img.includes("/")) {
    return `${API_HOST}/${img}`;
  }

  return `${API_HOST}/media/images/media/${img}`;
};

const getMediaId = (item: MediaItemDto): number => {
  return item.mediaItemID ?? item.mediaItemId ?? item.id ?? 0;
};

const getTitle = (item: MediaItemDto): string => {
  return item.titleName ?? item.title ?? "Chưa có tên";
};

const getMediaType = (item: MediaItemDto): MediaType => {
  const rawType = item.mediaItemType ?? item.type ?? "audio";

  return rawType.toLowerCase() === "video" ? "video" : "audio";
};

export const mapMediaItemDtoToMedia = (item: MediaItemDto): Media => {
  const mediaId = getMediaId(item);
  const type = getMediaType(item);

  const artistId =
    item.artistID ??
    item.artistId ??
    item.artist?.artistID ??
    item.artist?.artistId ??
    item.artist?.id ??
    0;

  const artistName =
    item.artistName ??
    item.ArtistName ??
    item.artist?.artistName ??
    item.artist?.name ??
    "Không rõ nghệ sĩ";

  const image =
    item.mediaItemImage ??
    item.thumbnailUrl ??
    item.imageUrl ??
    item.coverUrl;

  return {
    id: String(mediaId),
    title: getTitle(item),
    description: item.description ?? "",
    type,
    status: "published",
    url: `${API_HOST}/api/media/${mediaId}/stream`,
    thumbnailUrl: buildImageUrl(
      item.mediaItemImage ?? item.image ?? item.coverUrl
    ),
    duration: item.duration ?? 0,

    artist: {
      id: item.artistID ?? item.artistId ?? 0,
      name: item.artistName ?? "Unknown Artist",
    },

    genre: item.mediaItemTag ?? item.genre ?? undefined,

    albumId: item.albumID ?? item.albumId,
    albumName: item.albumName,

    playlistId: item.playlistID ?? item.playlistId,
    playlistName: item.playlistName,

    createdAt: item.uploadAT ?? item.createdAt ?? new Date().toISOString(),
  };
};