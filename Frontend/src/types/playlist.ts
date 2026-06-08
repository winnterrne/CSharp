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
}

export interface PlaylistTrack {
  id: number;
  media: Media;
}

export interface PlaylistDetailDto {
  playlistID?: number;
  playlistId?: number;
  id?: number;
  playlistName?: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
  songs?: MediaItemDto[];
  tracks?: PlaylistTrack[];
}

export const mapPlaylistDetailDtoToPlaylist = (
  item: PlaylistDetailDto,
): Playlist => {
  const id = item.playlistID ?? item.playlistId ?? item.id ?? 0;

  const tracksFromSongs: PlaylistTrack[] =
    item.songs?.map((song, index) => ({
      id: Number(song.mediaItemID ?? index + 1),
      media: mapMediaItemDtoToMedia(song),
    })) ?? [];

  const tracks = item.tracks ?? tracksFromSongs;

  return {
    id,
    playlistID: id,
    name: item.playlistName ?? item.name ?? "Playlist chưa có tên",
    playlistName: item.playlistName ?? item.name ?? "Playlist chưa có tên",
    description: item.description ?? "",
    tracks,
    trackCount: tracks.length,
    isPublic: item.isPublic ?? true,
  };
};