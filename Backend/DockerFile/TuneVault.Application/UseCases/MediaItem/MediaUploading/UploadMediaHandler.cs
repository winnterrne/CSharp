using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public class UploadMediaHandler : IRequestHandler<UploadMediaCommand, MediaItemDto>
{
    private readonly IMediaItemRepository _mediaRepo;
    private readonly IFileStorageService _fileStorage;
    public UploadMediaHandler(IMediaItemRepository mediaRepo, IFileStorageService fileStorage)
    {
        _mediaRepo = mediaRepo;
        _fileStorage = fileStorage;
    }

    public async Task<MediaItemDto> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
    {
        var folder = request.MediaItemType.ToLower() == "audio" ? "audio" : "video";
        var filePath = await _fileStorage.SaveFileAsync(
            request.File.OpenReadStream(),
            request.File.FileName,
            folder
        );
        var media = new Domain.Entities.MediaItem
        {
            MediaItemID = 0,  // DB sẽ tự tăng IDENTITY
            TitleName = request.TitleName,
            Description = request.Description,
            MediaItemTag = request.MediaItemTag,
            MediaItemType = request.MediaItemType,
            Duration = request.Duration,
            filePath = filePath,
            ArtistID = request.ArtistID,
            AlbumID = request.AlbumID,
            UserID = request.UserID,
            UploadAt = DateTime.UtcNow,
            IsDeleted = false
        };

        var mediaID = await _mediaRepo.CreateMediaAsync(media);
        media.MediaItemID = mediaID;

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
            media.AlbumID,
            media.UserID,
            media.UploadAt
        );
    }
}