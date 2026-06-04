using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class DeletePlaylistHandler
    : IRequestHandler<DeletePlaylistCommand, int>
{
    private readonly IPlaylistRepository _playlistRepo;

    public DeletePlaylistHandler(
        IPlaylistRepository playlistRepo)
    {
        _playlistRepo = playlistRepo;
    }

    public async Task<int> Handle(
        DeletePlaylistCommand request,
        CancellationToken cancellationToken)
    {
        return await _playlistRepo
            .DeletePlaylistAsync(
                request.PlaylistID);
    }
}