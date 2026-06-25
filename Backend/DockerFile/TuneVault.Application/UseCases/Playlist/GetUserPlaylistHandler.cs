using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class GetUserPlaylistHandler 
    : IRequestHandler<GetUserPlaylistQuery, IEnumerable<MyPlaylistDto>>
{
    private readonly IPlaylistRepository _playlistRepo;

    public GetUserPlaylistHandler(IPlaylistRepository playlistRepository)
    {
        _playlistRepo = playlistRepository;
    }

    public async Task<IEnumerable<MyPlaylistDto>> Handle(
        GetUserPlaylistQuery request,
        CancellationToken cancellationToken)
    {
        var result = await _playlistRepo.GetUserPlaylistsAsync(request.UserID);

        return result.Playlists.Select(x => new MyPlaylistDto(
            x.PlaylistID,
            x.PlaylistName,
            x.UserID,
            result.TrackCounts.TryGetValue(x.PlaylistID, out var count) ? count : 0
        ));
    }
}