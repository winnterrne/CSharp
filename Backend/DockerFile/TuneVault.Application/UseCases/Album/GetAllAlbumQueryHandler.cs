using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Albums;

public class GetAllAlbumsHandler : IRequestHandler<GetAllAlbumQuery, IEnumerable<AlbumDto>>
{
    private readonly IAlbumRepository _repo;

    public GetAllAlbumsHandler(IAlbumRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AlbumDto>> Handle(GetAllAlbumQuery request, CancellationToken cancellationToken)
    {
        var rawData = await _repo.GetAllAlbumsAsync();

        return rawData.Select(a => new AlbumDto(
            a.Album.AlbumID,
            a.Album.AlbumName,
            a.Album.Title,
            a.Album.AlbumItemImage,
            a.Album.ReleaseDate,
            a.Album.UploadAt,
            a.Album.ArtistID,
            a.ArtistName,       
            a.Album.UserID
        ));
    }
}