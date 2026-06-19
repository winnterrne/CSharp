using MediatR;
using TuneVault.Domain.Interfaces;
public class GetPublicUserPlaylistHandler : IRequestHandler<GetPublicUserPlaylistQuery, object>
{
    private readonly IPlaylistRepository _repo;

    public GetPublicUserPlaylistHandler(IPlaylistRepository repo)
    {
        _repo = repo;
    }

    public async Task<object> Handle(GetPublicUserPlaylistQuery request, CancellationToken cancellationToken)
    {
        var (playlists, trackCounts) = await _repo.GetPublicUserPlaylistsAsync(request.UserId);

        return playlists.Select(p => new
        {
            p.PlaylistID,
            p.PlaylistName,
            p.Description,
            p.IsPublic,
            p.UserID,
            TrackCount = trackCounts.TryGetValue(p.PlaylistID, out var count) ? count : 0,
        });
    }
}