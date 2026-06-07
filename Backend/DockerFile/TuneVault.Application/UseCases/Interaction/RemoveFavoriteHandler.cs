using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Interaction;
public class RemoveFavoriteHandler : IRequestHandler<RemoveFavoriteCommand, int>
{
    private readonly IInteractionRepository _repo;
    public RemoveFavoriteHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle (RemoveFavoriteCommand request, CancellationToken cancellationToken)
    {
        return await _repo.RemoveFavoriteAsync(request.UserID, request.MediaItemID);
    }
}