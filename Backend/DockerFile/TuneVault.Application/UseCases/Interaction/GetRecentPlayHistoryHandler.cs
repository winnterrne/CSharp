using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;

public class GetRecentPlayHistoryHandler : IRequestHandler<GetRecentPlayHistoryQuery, IEnumerable<PlayHistoryDto>>
{
    private readonly IInteractionRepository _repo;
    public GetRecentPlayHistoryHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<IEnumerable<PlayHistoryDto>> Handle (GetRecentPlayHistoryQuery request, CancellationToken cancellationToken)
    {
        var result = await _repo.GetRecentPlayHistoryAsync(request.UserId, request.Limit);
        return result.Select(p => new PlayHistoryDto
        (
            p.MediaItemID,
            p.MediaItem.TitleName,
            p.MediaItem.MediaItemImage,
            p.PlayedAt ?? DateTime.UtcNow
        ));
    }
}
