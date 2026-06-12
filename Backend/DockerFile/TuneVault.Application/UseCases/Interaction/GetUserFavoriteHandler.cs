using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;

public class GetUserFavoriteHandler : IRequestHandler<GetUserFavoriteQuery, IEnumerable<FavoriteDto>>
{
    private readonly IInteractionRepository _repo;

    public GetUserFavoriteHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<IEnumerable<FavoriteDto>> Handle(GetUserFavoriteQuery request, CancellationToken cancellationToken)
    {
        var result = await _repo.GetUserFavoritesAsync(request.UserID);
        return result.Select(x => new FavoriteDto (
            x.MediaItemID,
            x.TitleName,
            x.MediaItemImage
        ));
    }

}