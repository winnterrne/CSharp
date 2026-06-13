using System;
using Microsoft.AspNetCore.Http;

namespace TuneVault.Application.DTOs;


// Nhận từ client khi upload — dùng IFormFile cho file
public record UploadMediaRequestDto(
    string TitleName,
    string? Description,
    string? MediaItemTag,
    string MediaItemType,    // "audio" hoặc "video"
    int? Duration,
    int? ArtistID,
    int? AlbumID
);

// Trả về sau khi upload thành công
public record MediaItemDto(
    int MediaItemID,
    string? TitleName,
    string? FilePath,
    string? MediaItemImage,
    string? MediaItemTag,
    string? MediaItemType,
    int? Duration,
    string? Description,
    int? ArtistID,
    string? ArtistName,
    int? AlbumID,
    string? AlbumName,
    string? UserID,
    DateTime UploadAT
);

public class UploadMediaFormDto
{
    public string TitleName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? MediaItemTag { get; set; }
    public string MediaItemType { get; set; } = string.Empty;
    public int? Duration { get; set; }
    public int? ArtistID { get; set; }
    public int? AlbumID { get; set; }
    public IFormFile File { get; set; } = null!; // ← file nằm trong class
}
public record MediaStreamInfoDto
(
    int MediaItemID,
    string? TitleName,
    string? MediaItemImage,
    int? Duration,
    string? MediaItemType,
    string filePath,      
    string? ArtistName 
);

public record UpdateMediaRequestDto(
    string? TitleName,
    string? Description,
    string? MediaItemTag,
    string? MediaItemImage,
    int? ArtistID,
    int? AlbumID
);

public record SearchResultDto(
    IEnumerable<MediaItemDto> Tracks,
    IEnumerable<ArtistDto> Artists,
    IEnumerable<PlaylistDto> Playlists,
    int TotalPages
);

public record MediaItemRecommendationDto(
    int MediaItemID,
    string? TitleName,
    string? ArtistName,
    string? FilePath
);
