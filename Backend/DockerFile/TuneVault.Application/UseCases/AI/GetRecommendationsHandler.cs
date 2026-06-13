using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Interfaces;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;


namespace TuneVault.Application.UseCases;

public class GetRecommendationsQueryHandler : IRequestHandler<GetRecommendationsQuery, List<MediaItemRecommendationDto>>
{
    private readonly IMediaItemRepository _mediaRepo;
    private readonly IInteractionRepository _interactionRepo;
    private readonly IAIService _aiService;

    public GetRecommendationsQueryHandler(IMediaItemRepository mediaRepo, IInteractionRepository interactionRepo, IAIService aiService)
    {
        _mediaRepo = mediaRepo;
        _interactionRepo = interactionRepo;
        _aiService = aiService;
    }

    public async Task<List<MediaItemRecommendationDto>> Handle(GetRecommendationsQuery request, CancellationToken cancellationToken)
    {
        var recentHistory = await _interactionRepo.GetRecentPlayHistoryAsync(request.UserID);
        var favorites = await _interactionRepo.GetUserFavoritesAsync(request.UserID);

        string historyTitles = String.Join(",", recentHistory.Select(h => h.MediaItem.TitleName));
        string favoriteTitles = String.Join(",", favorites.Select(f => f.TitleName));

        string prompt = $@"
                Người dùng có lịch sử nghe nhạc: {historyTitles}. 
                Các bài hát yêu thích: {favoriteTitles}. 
                Dựa trên dữ liệu này, hãy gợi ý 5 tên bài hát khác. 
                Vui lòng CHỈ trả về tên các bài hát, cách nhau bởi dấu phẩy, không giải thích thêm.";

        string aiResponse = await _aiService.CompleteAsync(prompt, cancellationToken);

        string[] suggestedTitles = aiResponse.Split(',').Select(t => t.Trim()).Where( t => !string.IsNullOrEmpty(t)).ToArray();

        var recommendMediaItems = new List<MediaItemRecommendationDto>();

        foreach (var title in suggestedTitles)
        {
            var matchedItem = await _mediaRepo.GetMediaByNameAsync(title);
            if(matchedItem != null)
            {
                recommendMediaItems.Add(new MediaItemRecommendationDto
                (
                    matchedItem.MediaItemID,
                    matchedItem.TitleName,
                    matchedItem.ArtistName, 
                    matchedItem.filePath
                ));
            }
        }
        return recommendMediaItems;
    }
}