using MediatR;
namespace TuneVault.Application.UseCases.Playlist;

public record UpdatePlaylistCommand(
    int PlaylistID,
    string PlaylistName,
    bool IsPublic,
    string? Description
) : IRequest<int>;