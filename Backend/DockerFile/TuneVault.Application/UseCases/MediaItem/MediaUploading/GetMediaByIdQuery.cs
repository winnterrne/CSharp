using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public record GetMediaByIdQuery
(
    int MediaItemID
) : IRequest<MediaItemDto?>;