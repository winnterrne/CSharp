using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases;

public class GetRecommendationsQueryHandler
    : IRequestHandler<GetRecommendationsQuery, List<MediaItemRecommendationDto>>
{
    private readonly IMediaItemRepository _mediaRepo;
    private readonly IInteractionRepository _interactionRepo;
    private readonly IAIService _aiService;

    public GetRecommendationsQueryHandler(
        IMediaItemRepository mediaRepo,
        IInteractionRepository interactionRepo,
        IAIService aiService)
    {
        _mediaRepo = mediaRepo;
        _interactionRepo = interactionRepo;
        _aiService = aiService;
    }

    public async Task<List<MediaItemRecommendationDto>> Handle(
        GetRecommendationsQuery request,
        CancellationToken cancellationToken)
    {
        var recentHistory =
            await _interactionRepo.GetRecentPlayHistoryAsync(request.UserID);

        var favorites =
            await _interactionRepo.GetUserFavoritesAsync(request.UserID);

        var allSongs =
            (await _mediaRepo.GetAllMediaAsync())
            .Where(x => !x.IsDeleted)
            .Where(x => !string.IsNullOrWhiteSpace(x.TitleName))
            .ToList();

        var listenedSongs = recentHistory
            .Where(x => x.MediaItem != null)
            .Select(x => x.MediaItem!.TitleName)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var favoriteSongs = favorites
            .Select(x => x.TitleName)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var favoriteArtist = recentHistory
            .Where(x => x.MediaItem?.ArtistName != null)
            .GroupBy(x => x.MediaItem!.ArtistName)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefault();

        string historyTitles = string.Join(", ", listenedSongs);

        string favoriteTitles = string.Join(", ", favoriteSongs);

        string availableSongs = string.Join(
            ", ",
            allSongs
                .Where(x =>
                    !listenedSongs.Contains(x.TitleName!) &&
                    !favoriteSongs.Contains(x.TitleName!))
                .Select(x => x.TitleName)
        );

        string prompt = $@"
                        Người dùng đã nghe:
                        {historyTitles}

                        Các bài hát yêu thích:
                        {favoriteTitles}

                        Danh sách bài hát hiện có trong hệ thống:
                        {availableSongs}

                        Chỉ được chọn bài hát từ danh sách trên.

                        Hãy đề xuất 5 bài hát phù hợp nhất.

                        Chỉ trả về tên bài hát, phân cách bằng dấu phẩy.
                        Không giải thích thêm.
                        ";

        HashSet<string> suggestedTitles;

    try
    {
        string aiResponse =
            await _aiService.CompleteAsync(prompt, cancellationToken);

        suggestedTitles = aiResponse
            .Split(',')
            .Select(x => x.Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Gemini Error: {ex.Message}");

        var random = new Random();

        suggestedTitles = allSongs
            .Where(song =>
                song.TitleName != null &&
                !listenedSongs.Contains(song.TitleName) &&
                !favoriteSongs.Contains(song.TitleName))
            .OrderByDescending(song =>
                song.ArtistName == favoriteArtist)
            .ThenBy(_ => random.Next())
            .Take(5)
            .Select(song => song.TitleName!)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
            }

        var recommendations = allSongs
            .Where(song =>
                song.TitleName != null &&   
                suggestedTitles.Contains(song.TitleName))
            .Take(5)
            .Select(song => new MediaItemRecommendationDto(
                song.MediaItemID,
                song.TitleName,
                song.ArtistName,
                song.MediaItemImage,
                song.filePath,
                song.MediaItemTag,
                song.MediaItemType,
                song.Duration,
                song.UploadAt
            ))
            .ToList();

        if (recommendations.Count == 0)
            {
                var random = new Random();

                recommendations = allSongs
                    .Where(song =>
                        song.TitleName != null &&
                        !listenedSongs.Contains(song.TitleName) &&
                        !favoriteSongs.Contains(song.TitleName))
                    .OrderByDescending(song =>
                        song.ArtistName == favoriteArtist)
                    .ThenBy(_ => random.Next())
                    .Take(5)
                    .Select(song => new MediaItemRecommendationDto(
                        song.MediaItemID,
                        song.TitleName,
                        song.ArtistName,
                        song.MediaItemImage,
                        song.filePath,
                        song.MediaItemTag,
                        song.MediaItemType,
                        song.Duration,
                        song.UploadAt
                    ))
                    .ToList();
            }
        return recommendations;
    }
}