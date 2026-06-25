namespace TuneVault.Application.DTOs;
public record FavoriteDto
(
    int MediaItemID,
    string? TitleName,
    string? MediaItemImage,
    string? MediaItemTag,
    int? duration,
    int? Artistid,
    string? ArtistName
);
