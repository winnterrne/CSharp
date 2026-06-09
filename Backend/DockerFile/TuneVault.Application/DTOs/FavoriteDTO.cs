namespace TuneVault.Application.DTOs;
public record FavoriteDTO
{
    public int MediaItemID { get; set; }
    public string? TitleName { get; set; }
    public string? MediaItemImage { get; set; }

}