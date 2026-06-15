using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IAlbumRepository
    {
        Task<Album> GetAlbumByIdAsync(int albumId);
        Task<IEnumerable<Album>> GetAlbumsByArtistAsync(int artistId);
        Task<int> CreateAlbumAsync(Album album);
        Task<int> UpdateAlbumAsync(Album album);
        Task<int> DeleteAlbumAsync(string albumId);
        Task<IEnumerable<(Album Album, string ArtistName)>> GetAllAlbumsAsync();
    }
}