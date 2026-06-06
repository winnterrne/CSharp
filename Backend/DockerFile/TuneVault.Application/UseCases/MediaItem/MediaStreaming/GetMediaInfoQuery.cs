using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.MediaItem.MediaStreaming;

public record GetMediaInfoQuery(
    int MediaItemID
): IRequest<MediaStreamInfoDto>;