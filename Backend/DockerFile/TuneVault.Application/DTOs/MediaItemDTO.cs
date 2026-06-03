namespace TuneVault.Application.DTOs;

public record MediaStreamInfoDto
(
    int MediaItemID,
    string? TitleName,
    string? MediaItemImage,
    int? Duration,
    string? MediaType,
    string StreamUrl,      
    string? ArtistName 

);