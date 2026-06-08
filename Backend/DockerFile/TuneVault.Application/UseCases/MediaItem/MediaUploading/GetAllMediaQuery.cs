using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public record GetAllMediaQuery()
    : IRequest<IEnumerable<MediaItemDto>>;