using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Interaction;

public record GetUserFavoriteQuery(
    string UserID
) :IRequest<IEnumerable<FavoriteDto>>;