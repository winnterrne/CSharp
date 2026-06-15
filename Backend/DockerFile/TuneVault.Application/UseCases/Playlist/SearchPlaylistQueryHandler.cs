using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playlist;

public class SearchPlaylistQueryHandler  : IRequestHandler<SearchPlaylistQuery, SearchPlaylistResultDto>
{
    private readonly IPlaylistRepository _playlistRepo;

    public SearchPlaylistQueryHandler(IPlaylistRepository playlistRepo)
    {
        _playlistRepo = playlistRepo;
    }

    public async Task<SearchPlaylistResultDto> Handle(SearchPlaylistQuery request,CancellationToken cancellationToken)
    {
        int pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        int pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

        int skip = (pageNumber - 1) * pageSize;

        var playlists = await _playlistRepo.SearchAsync(request.KeyWord,skip,pageSize);

        var playlistDtos = playlists.Playlists.Select(
            p => new PlaylistDto(
                p.PlaylistID,
                p.PlaylistName,
                p.UserID
            )
        );

        int totalPages = playlists.TotalCount > 0 ? (int)Math.Ceiling((double)playlists.TotalCount / pageSize): 0;

        return new SearchPlaylistResultDto(
            playlistDtos,
            playlists.TotalCount,
            totalPages
        );
    }
}