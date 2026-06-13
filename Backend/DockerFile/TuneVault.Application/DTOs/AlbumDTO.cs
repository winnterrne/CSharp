namespace TuneVault.Application.DTOs;

public record AlbumDto(
    int? AlbumID,
    string? AlbumName,         
    string? Title,
    string? AlbumItemImage,    
    DateTime? ReleaseDate,  
    DateTime? UploadAT,     
    int? ArtistID,
    string? ArtistName,     
    string? UserID            
);