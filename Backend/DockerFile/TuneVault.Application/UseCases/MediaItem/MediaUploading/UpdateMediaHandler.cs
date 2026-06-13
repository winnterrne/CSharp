using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public class UpdateMediaHandler : IRequestHandler<UpdateMediaCommand, MediaItemDto>
{
    private readonly IMediaItemRepository _mediaRepo;

    public UpdateMediaHandler(IMediaItemRepository mediaRepo)
    {
        _mediaRepo = mediaRepo;
    }

    public async Task<MediaItemDto> Handle(UpdateMediaCommand request, CancellationToken cancellationToken)
    {
        var media = await _mediaRepo.GetMediaByIdAsync(request.MediaItemID);

        if (media == null)
        {
            throw new Exception("Không tìm thấy media");
        }

        if (media.UserID != request.UserID)
        {
            throw new Exception("Bạn không có quyền sửa media này");
        }
            
        media.TitleName      = request.TitleName      ?? media.TitleName;
        media.Description    = request.Description    ?? media.Description;
        media.MediaItemTag   = request.MediaItemTag   ?? media.MediaItemTag;
        media.MediaItemImage = request.MediaItemImage ?? media.MediaItemImage;
        media.ArtistID       = request.ArtistID       ?? media.ArtistID;
        media.AlbumID        = request.AlbumID        ?? media.AlbumID;
            
        await _mediaRepo.UpdateMediaAsync(media);

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
            media.AlbumID,
            media.ArtistName,
            media.UserID,
            media.UploadAt
        );
    }
}