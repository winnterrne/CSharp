using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Services;

public class AIService : IAIService
{
    public Task<string> GenerateDescriptionAsync(
        string title,
        string artist,
        string genre)
    {
        return Task.FromResult(
            $"Mô tả tự động cho bài hát: {title} - Nghệ sĩ: {artist} - Thể loại: {genre}"
        );
    }
}