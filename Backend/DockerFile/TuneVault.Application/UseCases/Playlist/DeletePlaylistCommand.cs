using MediatR;

namespace TuneVault.Application.UseCases.Playlist;

public record DeletePlaylistCommand(
    int PlaylistID
) : IRequest<int>;