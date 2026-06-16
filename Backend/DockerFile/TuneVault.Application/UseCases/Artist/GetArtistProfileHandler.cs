using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Artist;
public  class GetArtistProfileHandler : IRequestHandler<GetArtistProfileQuery, ArtistProfileDto>
{
    private readonly IArtistRepository _repo;
    public GetArtistProfileHandler(IArtistRepository repo)
    {
        _repo = repo;
    }
    public async Task<ArtistProfileDto> Handle (GetArtistProfileQuery request, CancellationToken cancellationToken)
    {
        var artist = await _repo.GetArtistProfileByIdAsync(request.ArtistId);
        if(artist == null) return null;
        return new ArtistProfileDto(
            artist.ArtistID,
            artist.ArtistName,
            artist.ArtistImage,
            artist.Bio
        );
    }
} 