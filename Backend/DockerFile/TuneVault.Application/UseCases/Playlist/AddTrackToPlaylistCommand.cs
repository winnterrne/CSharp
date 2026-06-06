using MediatR;

namespace TuneVault.Application.UseCases.Playlist;

public record AddTrackToPlaylistCommand(
    int PlaylistID,
    int MediaItemID
) : IRequest<int>;