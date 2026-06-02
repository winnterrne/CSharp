using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Infrastructure.Dapper;
namespace TuneVault.Infrastructure.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly DataContextDapper _db;

        public AlbumRepository(DataContextDapper db)
        {
            _db=db;
        }
        //Lấy thông tin album theo ID, chỉ lấy những album chưa bị xóa (IsDeleted = 0)
        public async Task<Album> GetAlbumByIdAsync(string albumId)
        {
            string sql = @"SELECT * FROM Album WHERE AlbumID = @AlbumID AND IsDeteled = 0";
            return await _db.LoadDataSingleAsync<Album>(sql, new {AlbumID = albumId});        
        }
        //Lấy tất cả album của một nghệ sĩ, chỉ lấy những album chưa bị xóa (IsDeleted = 0)
        public async Task<IEnumerable<Album>> GetAlbumsByArtistAsync(string artistId)
        {
            string sql = @"SELECT * FROM Album WHERE Artist = @Artist AND IsDeteled = 0";
            return await _db.LoadAllDataSingleAsync<Album>(sql, new {Artist = artistId});  
        }
        //Lấy tất cả album, chỉ lấy những album chưa bị xóa (IsDeleted = 0)
        public async Task<int> CreateAlbumAsync(Album album)
        {
            string sql = @"INSERT INSERT INTO Album 
                            (AlbumName, Title, AlbumItemImage, ReleaseDate, Upload, ArtistID, UserId, IsDeleted)
                            OUTPUT INSERTED.AlbumID
                            VALUES
                            (@AlbumName, @Title, @AlbumItemImage, @ReleaseDate, @Upload, @ArtistID, @UserId, @IsDeleted)";
            return await _db.ExecuteScalarAsync<int>(sql, album);  
        }
        //Cập nhật thông tin album, chỉ cập nhật những album chưa bị xóa (IsDeleted = 0)
        public async Task<int> UpdateAlbumAsync(Album album)
        {
            string sql = @"UPDATE Album 
                           SET AlbumName = @AlbumName,
                           SET AlbumItemImage = @AlbumItemImage
                           WHERE AlbumID = @AlbumID AND IsDeleted = 0";
                           
            return await _db.ExecuteDataAsync(sql, album);
        }
        //Xóa album bằng cách đặt cột IsDeleted = 1, không xóa dữ liệu thực sự khỏi cơ sở dữ liệu
        public async Task<int> DeleteAlbumAsync(string albumId)
        {
           string sql = @"UPDATE Album
                           SET IsDeleted = 1
                           WHERE AlbumID = @AlbumID";
                           
            return await _db.ExecuteDataAsync(sql, new { AlbumID = albumId });
        }
    }
}