using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class GetPlaylistByIdHandler: IRequestHandler<GetPlaylistByIdQuery,PlaylistDetailSongDto?>
{
    private readonly IPlaylistRepository _playlistRepo;

    public GetPlaylistByIdHandler(IPlaylistRepository playlistRepo)
    {
        _playlistRepo = playlistRepo;
    }

    public async Task<PlaylistDetailSongDto?> Handle(GetPlaylistByIdQuery request,CancellationToken cancellationToken)
    {
        var playlist =await _playlistRepo.GetPlaylistByIdAsync(request.PlaylistID);

        if (playlist == null)
            return null;

        var tracks =await _playlistRepo.GetTracksByPlaylistIdAsync(request.PlaylistID);

        var songs =tracks.Select(
            track =>new PlaylistSongDto(
                        track.MediaItemID,
                        track.TitleName ?? "",
                        track.ArtistID?.ToString() ?? "",
                        track.AlbumID?.ToString(),
                        track.Duration ?? 0,
                        track.filePath ?? ""
                    )
            ).ToList();

        return new PlaylistDetailSongDto(
            playlist.PlaylistID,
            playlist.PlaylistName ?? "",
            playlist.IsPublic??true,
            playlist.Description ?? "",
            int.TryParse(
                playlist.UserID,
                out var userId)
                ? userId
                : 0,
            songs
        );
    }
}