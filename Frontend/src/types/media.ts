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
  thumbnailUrl?: string;
  imageUrl?: string;
  coverUrl?: string;

  mediaItemTag?: string;
  mediaItemType?: string;

  duration?: number;
  description?: string;

  artistID?: number;
  artistId?: number;
  artistName?: string;
  ArtistName?: string;
  artistImage? : string;

  artist?: {
    id?: number;
    artistID?: number;
    artistId?: number;
    name?: string;
    artistName?: string;
  };

  albumID?: number;
  albumId?: number;
  albumName?: string;

  userID?: string;
  uploadAT?: string;
  createdAt?: string;
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

  if (img.startsWith("http")) return img;

  if (img.startsWith("/")) return `http://localhost:5081${img}`;

  if (img.includes("/")) return `http://localhost:5081/${img}`;

  return `http://localhost:5081/media/images/media/${img}`;
};

export const mapMediaItemDtoToMedia = (item: MediaItemDto): Media => {
  console.log(item);
  const mediaId = item.mediaItemID ?? item.mediaItemId ?? item.id ?? 0;

  const type: MediaType =
    item.mediaItemType?.toLowerCase() === "video" ? "video" : "audio";

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

  const artistAvatar =
  item.artistImage ??
  "";

  const image =
    item.mediaItemImage ??
    item.thumbnailUrl ??
    item.imageUrl ??
    item.coverUrl;

  return {
    id: String(mediaId),
    title: item.titleName ?? item.title ?? "Chưa có tên",
    description: item.description ?? "",
    type,
    status: "published",
    url: `http://localhost:5081/api/media/${mediaId}/stream`,
    thumbnailUrl: buildImageUrl(image),
    duration: item.duration ?? 0,
    artist: {
      id: artistId,
      name: artistName,
      avatarUrl: item.artistImage
    ? `http://localhost:5081/media/images/artist/${item.artistImage}`
    : "",
      
    },
    genre: item.mediaItemTag ?? undefined,
    albumId: item.albumID ?? item.albumId,
    albumName: item.albumName,
    createdAt: item.uploadAT ?? item.createdAt ?? new Date().toISOString(),
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