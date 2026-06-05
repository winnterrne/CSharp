using MediatR;

namespace TuneVault.Application.UseCases.Playlist;

public record RemoveTrackFromPlaylistCommand(
    int PlaylistID,
    int MediaItemID
) : IRequest<int>;