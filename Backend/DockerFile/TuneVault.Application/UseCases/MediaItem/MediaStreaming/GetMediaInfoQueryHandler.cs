using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.MediaItem;

public class GetMediaInfoQueryHandler : IRequestHandler<GetMediaInfoQuery, MediaStreamInfoDto>
{
    private readonly IMediaItemRepository _mediaItem;

    public GetMediaInfoQueryHandler(IMediaItemRepository mediaItem)
    {
        _mediaItem=mediaItem;
    }

    public async Task<MediaStreamInfoDto> Handle(GetMediaInfoQuery request, CancellationToken cancellationToken)
    {
        var media =  await _mediaItem.GetMediaInfoAsync(request.MediaItemID);
        if(media == null) throw new Exception("Media không tồn tại");
        string streamUrl = $"/api/media/{media.MediaItemID}/stream";
        return new MediaStreamInfoDto(
                media.MediaItemID,
                media.TitleName,
                media.MediaItemImage,
                media.Duration,
                media.MediaType,
                streamUrl,      
                media.ArtistName 
        );
    }

}

