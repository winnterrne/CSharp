using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces
{
    public interface IArtistRepository
    {
        Task<Artist> GetArtistByIdAsync(string artistId);
        Task<IEnumerable<Artist>> GetAllArtistsAsync();
        Task<int> CreateArtistAsync(Artist artist);
        Task<int> UpdateArtistAsync(Artist artist);
        Task<int> DeleteArtistAsync(string artistId);
    }
}