using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Artist;
public  class GetArtistProfileHandler : IRequestHandler<GetArtistProfileQuery, ArtistProfileDTO>
{
    private readonly IArtistRepository _repo;
    public GetArtistProfileHandler(IArtistRepository repo)
    {
        _repo = repo;
    }
    public async Task<ArtistProfileDTO> Handle (GetArtistProfileQuery request, CancellationToken cancellationToken)
    {
        var artist = await _repo.GetArtistProfileByIdAsync(request.ArtistId);
        if(artist == null) return null;
        var followers = await _repo.GetArtistFollowersCountAsync(request.ArtistId);
        return new ArtistProfileDTO(
            artist.ArtistID,
            artist.ArtistName,
            artist.ArtistImage,
            artist.Bio,
            followers 
        );
    }
} 