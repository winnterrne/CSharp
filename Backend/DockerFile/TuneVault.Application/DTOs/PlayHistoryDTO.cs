namespace TuneVault.Application.DTOs;
public record PlayHistoryResponeDto (
    int HistoryID,
    string UserID,
    int MediaItemID,
    DateTime PlayedAt
    
);
public record CreatePlayHistoryDto
(
    int MediaItemID 
);
public record PlayHistoryDto(
    int MediaItemID,
    string? TitleName,
    string? MediaItemImage,
    DateTime PlayedAt
);
