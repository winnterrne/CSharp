using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public class GetMediaByIdHandler : IRequestHandler<GetMediaByIdQuery, MediaItemDto?>
{
    private readonly IMediaItemRepository _mediaRepo;

    public GetMediaByIdHandler(IMediaItemRepository mediaRepo)
    {
        _mediaRepo = mediaRepo;
    }

    public async Task<MediaItemDto?> Handle(GetMediaByIdQuery request, CancellationToken cancellationToken)
    {
        var media = await _mediaRepo.GetMediaByIdAsync(request.MediaItemID);
        if(media == null) return null;
        return new MediaItemDto(
            media.MediaItemID,
            media.TitleName,
            media.filePath,
            media.MediaItemImage,
            media.MediaItemTag,
            media.MediaItemType,
            media.Duration,
            media.Description,
            media.ArtistID,
            media.ArtistName,
            media.ArtistImage,
            media.AlbumID,
            media.AlbumName,
            media.UserID,
            media.UploadAt
        );
    }
}