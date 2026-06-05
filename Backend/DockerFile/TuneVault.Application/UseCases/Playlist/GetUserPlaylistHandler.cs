using System.Security.Cryptography.X509Certificates;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class GetUserPlaylistHandler : IRequestHandler<GetUserPlaylistQuery, IEnumerable<PlaylistDto>>
{
    public readonly IPlaylistRepository _Playlistrepo;
    public GetUserPlaylistHandler(IPlaylistRepository playlistRepository)
    {
        _Playlistrepo = playlistRepository;
    }
    public async Task<IEnumerable<PlaylistDto>> Handle(GetUserPlaylistQuery request, CancellationToken cancellationToken)
    {
        var result = await _Playlistrepo.GetUserPlaylistsAsync(request.UserID);
        return result.Select(x => new PlaylistDto(
            x.PlaylistID,
            x.PlaylistName,
            x.UserID
        ));
    }
}