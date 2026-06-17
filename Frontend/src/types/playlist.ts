import type { Media, MediaItemDto } from "./media";
import { mapMediaItemDtoToMedia } from "./media";

export interface Playlist {
  id: number;
  playlistID?: number;

  name?: string;
  playlistName?: string;

  description?: string;
  coverUrl?: string;

  tracks: PlaylistTrack[];
  trackCount: number;

  isPublic: boolean;

  // Sidebar / Header
  userName?: string;
  ownerName?: string;

  user?: {
    userName?: string;
    name?: string;
  };
}

export interface PlaylistTrack {
  id: number;
  media: Media;
}

export interface PlaylistDetailDto {
  playlistID?: number;
  playlistId?: number;
  PlaylistID?: number;

  id?: number;

  playlistName?: string;
  PlaylistName?: string;

  name?: string;

  description?: string;
  Description?: string;

  // ✅ FIX PUBLIC / PRIVATE
  isPublic?: boolean;
  IsPublic?: boolean;

  songs?: MediaItemDto[];
  tracks?: PlaylistTrack[];

  trackCount?: number;
  TrackCount?: number;

  coverUrl?: string;
  CoverUrl?: string;

  userName?: string;
  UserName?: string;

  ownerName?: string;
  OwnerName?: string;

  user?: {
    userName?: string;
    name?: string;
  };
}

export const mapPlaylistDetailDtoToPlaylist = (
  item: PlaylistDetailDto,
): Playlist => {
  // DEBUG
  console.log("PLAYLIST DTO:", item);

  const id =
    item.playlistID ??
    item.playlistId ??
    item.PlaylistID ??
    item.id ??
    0;

  const tracksFromSongs: PlaylistTrack[] =
    item.songs?.map((song, index) => ({
      id: Number(song.mediaItemID ?? index + 1),
      media: mapMediaItemDtoToMedia(song),
    })) ?? [];

  const tracks = item.tracks ?? tracksFromSongs;

  return {
    id,
    playlistID: id,

    name:
      item.playlistName ??
      item.PlaylistName ??
      item.name ??
      "Playlist chưa có tên",

    playlistName:
      item.playlistName ??
      item.PlaylistName ??
      item.name ??
      "Playlist chưa có tên",

    description:
      item.description ??
      item.Description ??
      "",

    coverUrl:
      item.coverUrl ??
      item.CoverUrl,

    tracks,

    trackCount:
      item.trackCount ??
      item.TrackCount ??
      tracks.length,

    // ✅ FIX PUBLIC / PRIVATE
    isPublic:
      item.isPublic ??
      item.IsPublic ??
      true,

    userName:
      item.userName ??
      item.UserName,

    ownerName:
      item.ownerName ??
      item.OwnerName,

    user: item.user,
  };
};

export interface CreatePlaylistDto {
  PlaylistName: string;
  Description?: string;
  IsPublic: boolean;
}