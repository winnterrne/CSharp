using MediatR;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class CreatePlaylistHandler
    : IRequestHandler<CreatePlaylistCommand, int>
{
    private readonly IPlaylistRepository _Playlistrepo;

    public CreatePlaylistHandler(
        IPlaylistRepository playlistRepository)
    {
        _Playlistrepo = playlistRepository;
    }

    public async Task<int> Handle(
        CreatePlaylistCommand request,
        CancellationToken cancellationToken)
    {
        var playlist = new TuneVault.Domain.Entities.Playlist
        {
            PlaylistName = request.PlaylistName,
            IsPublic = request.IsPublic,
            Description = request.Description,
            UserID = request.UserID,
            IsDeleted = false
        };

        return await _Playlistrepo.CreatePlaylistAsync(
            playlist);
    }
}