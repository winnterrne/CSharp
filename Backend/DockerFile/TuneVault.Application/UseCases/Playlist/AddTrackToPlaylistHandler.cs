using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;
public class AddTrackToPlaylistHandler : IRequestHandler<AddTrackToPlaylistCommand, int>
{
    private readonly IPlaylistRepository _Playlistrepo;
    public AddTrackToPlaylistHandler(IPlaylistRepository playlistRepository)
    {
        _Playlistrepo = playlistRepository;
    }
    public async Task<int> Handle(AddTrackToPlaylistCommand request, CancellationToken cancellationToken)
    {
        return await _Playlistrepo.AddTrackToPlaylistAsync(request.PlaylistID, request.MediaItemID);
    }
}