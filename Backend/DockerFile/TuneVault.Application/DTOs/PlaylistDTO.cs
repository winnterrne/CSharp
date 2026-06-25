using System;
using Microsoft.AspNetCore.Http;

namespace TuneVault.Application.DTOs;

public record PlaylistDto (
    int PlaylistID,
    string? PlaylistName,
    string UserID
);
public record MyPlaylistDto (
    int PlaylistID,
    string? PlaylistName,
    string UserID,
    int TrackCount
);
public record PlaylistSongDto (
    int MediaItemID,
    string TitleName,
    int ArtistID,
    string? AlbumID,
    int Duration,
    string FilePath
);
// Lay chi tiet playlist va nhac cua bai hat
public record PlaylistDetailSongDto(
    int PlaylistID,
    string PlaylistName,
    bool IsPublic,
    string Description,
    int UserID,
    List<PlaylistSongDto> songs
);

public record CreatePlaylistDto(
    string PlaylistName,
    bool IsPublic,
    string? Description
);

public record  PlaylistTrackCountDto(
    int PlaylistID,
    int TrackCount
);

public record PlaylistDetailDto(
    int PlaylistID,
    string? PlaylistName,
    string? Description,
    bool IsPublic,
    List<MediaItemDto> Songs
);
public record SearchPlaylistDto(
    int PlaylistID,
    string? PlaylistName,
    bool? IsPublic,
    string? Description,
    string UserID
);

public record SearchPlaylistResultDto(
    IEnumerable<PlaylistDto> Playlists,
    int TotalCount,
    int TotalPages
);