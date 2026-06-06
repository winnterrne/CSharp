using MediatR;

namespace TuneVault.Application.UseCases.Playlist;

public record CreatePlaylistCommand(
    string PlaylistName,
    bool IsPublic,
    string? Description,
    string UserID
) : IRequest<int>;