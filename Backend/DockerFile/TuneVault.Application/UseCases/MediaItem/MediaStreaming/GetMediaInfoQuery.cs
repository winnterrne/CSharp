using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.MediaItem;

public record GetMediaInfoQuery(
    int MediaItemID
): IRequest<MediaStreamInfoDto>;