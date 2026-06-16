using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases;

public class SearchMediaQueryHandler : IRequestHandler<SearchMediaQuery ,SearchResultDto>
{
    private readonly IMediaItemRepository _mediaRepo;
    private readonly IArtistRepository _artistRepo;
    private readonly IPlaylistRepository _playlistRepo;

    public SearchMediaQueryHandler(IMediaItemRepository mediaRepo, IArtistRepository artistRepo, IPlaylistRepository playlistRepo)
    {
        _mediaRepo = mediaRepo;
        _artistRepo = artistRepo;
        _playlistRepo = playlistRepo;
    }

    public async Task<SearchResultDto> Handle(SearchMediaQuery request, CancellationToken cancellationToken)
    {
        int skip = (request.PageNumber - 1) * request.PageSize;

        var tracks  = await _mediaRepo.SearchAsync(request.KeyWord, skip, request.PageSize);
        var trackDtos = tracks.Items.Select(
            t => new MediaItemDto(
                 t.MediaItemID,
                t.TitleName,
                t.filePath,
                t.MediaItemImage,
                t.MediaItemTag,
                t.MediaItemType,
                t.Duration,
                t.Description,
                t.ArtistID,
                t.ArtistName,
                t.ArtistImage,
                t.AlbumID,
                t.AlbumName,
                t.UserID,
                t.UploadAt
            ));
        var artists = await _artistRepo.SearchAsync(request.KeyWord, skip, request.PageSize);
        var artistDtos = artists.Artists.Select(
            a => new ArtistDto(
                a.ArtistID, 
                a.ArtistName, 
                a.ArtistImage
            ));

        var playlists = await _playlistRepo.SearchAsync(request.KeyWord, skip, request.PageSize);
        var playlistDtos = playlists.Playlists.Select(
            p => new PlaylistDto(
                p.PlaylistID,
                p.PlaylistName,
                p.UserID
            ));

       
        int maxRecords = Math.Max(tracks.TotalCount, Math.Max(artists.TotalCount, playlists.TotalCount));
        int totalPages = maxRecords > 0 ? (int)Math.Ceiling((double)maxRecords / request.PageSize) : 0;  

        return new SearchResultDto(trackDtos, artistDtos, playlistDtos, totalPages);
    }   
}