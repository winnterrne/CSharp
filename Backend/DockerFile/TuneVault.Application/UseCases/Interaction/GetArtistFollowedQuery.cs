using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Interaction;

public record GetArtistFollowedQuery(
    string UserID
): IRequest<IEnumerable<ArtistFollowerDto>>;