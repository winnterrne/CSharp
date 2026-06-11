namespace TuneVault.Domain.Entities;

public class PlayHistoryDetail
{
    public int MediaItemID { get; set; }
    public string? TitleName { get; set; }
    public string? MediaItemImage { get; set; }
    public DateTime PlayedAt { get; set; }
}