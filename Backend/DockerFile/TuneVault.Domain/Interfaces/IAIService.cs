namespace TuneVault.Domain.Interfaces;
public interface IAIService
{
    Task<string> GenerateDescriptionAsync(
        string title,
        string artist,
        string genre);

    Task<string> CompleteAsync(string prompt, CancellationToken ct = default);
}