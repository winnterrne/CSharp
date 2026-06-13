namespace TuneVault.Application.DTOs;
public record FavoriteDto
(
    int MediaItemID,
    string? TitleName,
    string? MediaItemImage,
    int? Artistid,
    string? ArtistName
);
