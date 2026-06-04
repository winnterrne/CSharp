using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public record GetMediaByUserQuery(
    string UserID
) : IRequest<IEnumerable<MediaItemDto>>;