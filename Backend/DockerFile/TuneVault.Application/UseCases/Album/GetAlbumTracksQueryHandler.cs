using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases;

public class GetAlbumTracksHandler : IRequestHandler<GetAlbumTracksQuery, IEnumerable<MediaItemAlbumDto>>
{
    private readonly IMediaItemRepository _repo;

    public GetAlbumTracksHandler(IMediaItemRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<MediaItemAlbumDto>> Handle(GetAlbumTracksQuery request, CancellationToken cancellationToken)
    {
        var rawTracks=  await _repo.GetTracksByAlbumIdAsync(request.AlbumId);
        return rawTracks.Select(track => new MediaItemAlbumDto(
            track.MediaItemID,
            track.TitleName,
            track.filePath,
            track.MediaItemImage,
            track.MediaItemTag,
            track.Duration
        ));
    }
}