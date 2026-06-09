using System;
using Microsoft.AspNetCore.Http;

namespace TuneVault.Application.DTOs;

public record PlaylistDto (
    int PlaylistID,
    string? PlaylistName,
    string UserID
);

public record PlaylistSongDto (
    int MediaItemID,
    string TitleName,
    string ArtistID,
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
