using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Artist;

public record GetArtistProfileQuery(
    int ArtistId
): IRequest<ArtistProfileDto>;