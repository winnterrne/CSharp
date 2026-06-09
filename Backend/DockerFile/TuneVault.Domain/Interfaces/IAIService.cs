namespace TuneVault.Domain.Interfaces;
public interface IAIService
{
    Task<string> GenerateDescriptionAsync(
        string title,
        string artist,
        string genre);
}