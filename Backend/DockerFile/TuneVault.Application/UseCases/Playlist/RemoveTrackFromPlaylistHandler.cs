using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class RemoveTrackFromPlaylistHandler
    : IRequestHandler<RemoveTrackFromPlaylistCommand, int>
{
    private readonly IPlaylistRepository _playlistRepo;

    public RemoveTrackFromPlaylistHandler(
        IPlaylistRepository playlistRepo)
    {
        _playlistRepo = playlistRepo;
    }

    public async Task<int> Handle(
        RemoveTrackFromPlaylistCommand request,
        CancellationToken cancellationToken)
    {
        return await _playlistRepo.RemoveTrackFromPlaylistAsync(
            request.PlaylistID,
            request.MediaItemID
        );
    }
}