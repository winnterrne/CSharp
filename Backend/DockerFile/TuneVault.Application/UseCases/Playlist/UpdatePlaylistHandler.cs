using MediatR;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Playlist;

public class UpdatePlaylistHandler : IRequestHandler<UpdatePlaylistCommand, int>
{
    private readonly IPlaylistRepository _repo;
    public UpdatePlaylistHandler(IPlaylistRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle(UpdatePlaylistCommand request, CancellationToken cancellationToken)
    {
        var result = new Domain.Entities.Playlist
        {
            PlaylistID = request.PlaylistID,
            PlaylistName = request.PlaylistName,
            IsPublic = request.IsPublic,
            Description = request.Description,
            UserID = "" // Không cần thiết vì không cập nhật UserID 
        };
        return await _repo.UpdatePlaylistAsync(result);
    }
 }