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
            string sql = @"SELECT *  FROM Artist WHERE ArtistID = @ArtistID";

            return await _db.LoadDataSingleAsync<Artist>(sql, new { ArtistID = artistId});
        }
        public async Task<IEnumerable<Artist>> GetAllArtistsAsync()
        {
            string sql = @"SELECT *  FROM Artist";

            return await _db.LoadAllDataSingleAsync<Artist>(sql);
        }
        
        public async Task<int> CreateArtistAsync(Artist artist)
        {
            string sql = @" 
                INSERT INTO Artist 
                    (ArtistName, ArtistImage, CreateAt, IsDeleted)
                OUTPUT INSERTED.ArtistID
                VALUES
                    (@ArtistName, @ArtistImage, @CreateAt, 0)";
            
            return await _db.ExecuteScalarAsync<int>(sql, artist);
        }
        public async Task<int> UpdateArtistAsync(Artist artist)
        {
            string sql = @"UPDATE Artist 
                           SET ArtistName = @ArtistName,
                           SET ArtistImage = @ArtistImage
                           WHERE ArtistID = @ArtistID AND IsDeleted= 0";
                           
            return await _db.ExecuteDataAsync(sql, artist);
        }
        public async Task<int> DeleteArtistAsync(string artistId)
        {
            string sql = @"UPDATE Artist 
                           SET IsDeleted = 1
                           WHERE ArtistID = @ArtistID";
                           
            return await _db.ExecuteDataAsync(sql, new { ArtistID = artistId});
        }

        public async Task<(IEnumerable<Artist>Artists, int TotalCount)> SearchAsync(string keyword, int skip, int take)
        {
            string sql = @"
                SELECT * FROM Artist 
                WHERE ArtistName LIKE @keyword AND IsDeleted = 0
                ORDER BY ArtistName ASC
                OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

            string countSql = @"
            SELECT COUNT(*) FROM Artist 
            WHERE ArtistName LIKE @keyword AND IsDeleted = 0";

            var parameters = new { Keyword = $"%{keyword}%", skip, take };

            var artists = await _db.LoadAllDataSingleAsync<Artist>(sql, parameters);
            var totalCount = await _db.ExecuteScalarAsync<int>(countSql, parameters);

            return (artists, totalCount);
        }
    }
}