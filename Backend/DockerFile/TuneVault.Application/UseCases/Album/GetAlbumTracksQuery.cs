using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;
namespace TuneVault.Application.UseCases;

public record GetAlbumTracksQuery(
    int AlbumId
): IRequest<IEnumerable<MediaItemAlbumDto>>;