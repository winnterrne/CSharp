namespace TuneVault.Application.DTOs;
public class PlayHistoryDTO
{
    public int MediaItemID { get; set; }
    public string? TitleName { get; set; }
    public string? MediaItemImage { get; set; }
    public DateTime PlayedAt { get; set; }
}

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
