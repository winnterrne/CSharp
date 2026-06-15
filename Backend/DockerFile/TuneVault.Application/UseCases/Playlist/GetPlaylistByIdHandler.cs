using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class GetPlaylistByIdHandler 
    : IRequestHandler<GetPlaylistByIdQuery, PlaylistDetailDto>
{
    private readonly IPlaylistRepository _playlistRepo;

    public GetPlaylistByIdHandler(IPlaylistRepository playlistRepository)
    {
        _playlistRepo = playlistRepository;
    }

    public async Task<PlaylistDetailDto> Handle(
        GetPlaylistByIdQuery request,
        CancellationToken cancellationToken)
    {
        var result = await _playlistRepo.GetPlaylistByIdAsync(request.PlaylistID);

        return new PlaylistDetailDto(
            result.Playlist.PlaylistID,
            result.Playlist.PlaylistName,
            result.Playlist.Description,
            result.Playlist.IsPublic ?? true,
            result.Songs.Select(x => new MediaItemDto(
                x.MediaItemID,
                x.TitleName,
                x.filePath,
                x.MediaItemImage,
                x.MediaItemTag,
                x.MediaItemType,
                x.Duration,
                x.Description,
                x.ArtistID,
                x.ArtistName,
                x.AlbumID,
                x.AlbumName,
                x.UserID,
                x.UploadAt
            )).ToList()
        );
    }
}