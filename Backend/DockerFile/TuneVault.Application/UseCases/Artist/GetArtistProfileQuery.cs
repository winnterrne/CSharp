using MediatR;
namespace TuneVault.Application.UseCases.Artist;

public record GetArtistProfileQuery(
    int ArtistId
): IRequest<ArtistProfileDto>;