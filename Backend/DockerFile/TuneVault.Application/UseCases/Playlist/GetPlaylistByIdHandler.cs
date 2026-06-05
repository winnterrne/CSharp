using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.MediaItem.MediaUploading;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;
public class GetPlaylistByIdHandler : IRequestHandler<GetPlaylistByIdQuery, PlaylistDto>
{
    public readonly IPlaylistRepository _Playlistrepo;
    public GetPlaylistByIdHandler(IPlaylistRepository Playlistrepo)
    {
        _Playlistrepo = Playlistrepo;
    }
    public async Task<PlaylistDto?> Handle(GetPlaylistByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _Playlistrepo.GetPlaylistByIdAsync(request.PlaylistID);
        if(result == null) return null; 
        return new PlaylistDto (
            result.PlaylistID,
            result.PlaylistName,
            result.UserID
        );
    } 
}