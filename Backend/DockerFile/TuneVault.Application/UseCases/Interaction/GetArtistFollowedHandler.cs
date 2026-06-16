using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;

public class GetArtistFollowedQueryHandler
    : IRequestHandler<GetArtistFollowedQuery, IEnumerable<ArtistFollowerDto>>
{
    private readonly IInteractionRepository _repo;

    public GetArtistFollowedQueryHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<ArtistFollowerDto>> Handle(
        GetArtistFollowedQuery request,
        CancellationToken cancellationToken)
    {
        var artists = await _repo   
            .GetFollowedArtistAsync(request.UserID);

        return artists.Select(a => new ArtistFollowerDto(
            a.ArtistID,
            a.ArtistName,
            a.ArtistImage
        ));
    }
}