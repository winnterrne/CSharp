using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Albums;

public class CreateAlbumHandler : IRequestHandler<CreateAlbumCommand, int>
{
    private readonly IAlbumRepository _repo;

    public CreateAlbumHandler(IAlbumRepository repo)
    {
        _repo = repo;
    }

    public async Task<int> Handle(CreateAlbumCommand request, CancellationToken cancellationToken)
    {
        var newAlbum = new Album
        {
            AlbumID = 0,
            AlbumName = request.AlbumName,
            Title = request.Title,
            AlbumItemImage = request.AlbumItemImage,
            ReleaseDate = request.ReleaseDate,
            UploadAt = DateTime.Now,    
            ArtistID = request.ArtistID,
            UserID = request.UserID,
            IsDeleted = false     
        };

    
        return await _repo.CreateAlbumAsync(newAlbum);
    }
}