using MediatR;
using Microsoft.Extensions.Configuration.UserSecrets;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Interaction;
public class AddFavoriteHandler : IRequestHandler<AddFavoriteCommand, int>
{
    private readonly IInteractionRepository _repo;
    public AddFavoriteHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle (AddFavoriteCommand request, CancellationToken cancellationToken)
    {
        var result = new TuneVault.Domain.Entities.Favorite
        {
            UserID = request.UserID,
            MediaItemID = request.MediaItemID
        };  
        return await _repo.AddFavoriteAsync(result);
    }
}
