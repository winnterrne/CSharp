using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;

public class GetRecentPlayHistoryHandler : IRequestHandler<GetRecentPlayHistoryQuery, IEnumerable<PlayHistoryDTO>>
{
    private readonly IInteractionRepository _repo;
    public GetRecentPlayHistoryHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<IEnumerable<PlayHistoryDTO>> Handle (GetRecentPlayHistoryQuery request, CancellationToken cancellationToken)
    {
        var result = await _repo.GetRecentPlayHistoryAsync(request.UserId, request.Limit);
        return result.Select(p => new PlayHistoryDTO
        {
            MediaItemID = p.MediaItemID,
            TitleName = p.TitleName,
            MediaItemImage = p.MediaItemImage,
            PlayedAt = p.PlayedAt
        });
    }
}
