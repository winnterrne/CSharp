using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;


namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public class GetMediaByUserHandler : IRequestHandler<GetMediaByUserQuery, IEnumerable<MediaItemDto>>
{
    private readonly IMediaItemRepository _mediaRepo;

    public GetMediaByUserHandler(IMediaItemRepository mediaRepo)
    {
        _mediaRepo = mediaRepo;
    }

    public async Task<IEnumerable<MediaItemDto>> Handle(
        GetMediaByUserQuery request,
        CancellationToken cancellationToken)
    {
        var mediaList = await _mediaRepo.GetMediaByUserIdAsync(request.UserID);
        return mediaList.Select(media => new MediaItemDto(
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
        ));
    }
}