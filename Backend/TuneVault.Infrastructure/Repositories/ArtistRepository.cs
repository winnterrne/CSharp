using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Infrastructure.Dapper;
namespace TuneVault.Infrastructure.Repositories
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly DataContextDapper _db;
        public ArtistRepository(DataContextDapper db)
        {
            _db = db;
        }
        public async Task<Artist> GetArtistByIdAsync(string artistId)
        {
            string sql = @"SELECT *  FROM TuneVault.Artist WHERE ArtistId = @ArtistId";

            return await _db.LoadDataSingleAsync<Artist>(sql, new { ArtistId = artistId});
        }
        public async Task<IEnumerable<Artist>> GetAllArtistsAsync()
        {
            string sql = @"SELECT *  FROM TuneVault.Artist";

            return await _db.LoadAllDataSingleAsync<Artist>(sql);
        }
        
        public async Task<int> CreateArtistAsync(Artist artist)
        {
            string sql = @" 
                INSERT INTO TuneVault.Artist 
                    (ArtistName, ArtistImage, CreateAt, IsDeleted)
                OUTPUT INSERT @ArtistID
                VALUES
                    (@ArtistName, @ArtistImage, @CreateAt, 0)";
            
            return await _db.ExecuteDataAsync(sql, artist);
        }
        public async Task<int> UpdateArtistAsync(Artist artist)
        {
            string sql = @"UPDATE TuneVault.Artist 
                           SET ArtistName = @ArtistName,
                           SET ArtistImage = @ArtistImage
                           WHERE IDArtist = @IDArtist AND IsDelete = 0";
                           
            return await _db.ExecuteDataAsync(sql, artist);
        }
        public async Task<int> DeleteArtistAsync(string artistId)
        {
            string sql = @"UPDATE TuneVault.Artist 
                           SET IsDeleted = 1
                           WHERE ArtistId = @ArtistID";
                           
            return await _db.ExecuteDataAsync(sql, new { ArtistId = artistId });
        }
    }
}