using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;
using TuneVault.Infrastructure.Dapper;

namespace TuneVault.Infrastructure.Repositories;
public class MediaItemRepository : IMediaItemRepository
{
    private readonly DataContextDapper _db;
    public MediaItemRepository(DataContextDapper db)
    {
        _db = db;
    }
    // Query trả về 1 dòng dữ liệu 
    public async Task<MediaItem> GetMediaByIdAsync(int mediaId)
    {
        string sql = @"SELECT * FROM MediaItem WHERE MediaItemID = @MediaItemID AND IsDeleted = 0";
        return await _db.LoadDataSingleAsync<MediaItem>(sql, new { MediaItem = mediaId});
    }
    // Query trả về 1 list dữ liệu 
    public async Task<IEnumerable<MediaItem>> GetAllMediaAsync()
    {
        string sql = @"SELECT * FROM MediaItem WHERE IsDeleted = 0";
        return await _db.LoadAllDataSingleAsync<MediaItem>(sql);
    }
    // Query tra ve 1 list ten bai hat 
    public async Task<IEnumerable<MediaItem>> SearchMediaByNameAsync(string keyword)
    {
        string sql = @"SELECT * FROM MediaItem WHERE TitleName LIKE @keyword AND IsDeleted = 0";
        return await _db.LoadAllDataSingleAsync<MediaItem>(sql, new {Keyword = $"%{keyword}%"});
    }
    // Create 1 bai nhac 
    public async Task<int> CreateMediaAsync(MediaItem media)
    {
        string sql = @"INSERT INTO MediaItem (TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, Duration, UploadAT, Description, ArtistID, AlbumID, UserID, IsDeleted )
                     OUTPUT INSERTED.MediaItemID   
                     VALUES (@TitleName, @MediaItemImage, @filePath, @MediaItemTag, @MediaItemType, @Duration, @UploadAT, @Description, @ArtistID, @AlbumID, @UserID,0 )";
        return await _db.ExecuteScalarAsync<int>(sql, media);
    }
    // 
    public async Task<int> UpdateMediaAsync(MediaItem media)
    {
        string sql = @"UPDATE MediaItem
                    SET
                        TitleName = @TitleName,
                        MediaItemImage = @MediaItemImage,
                        Description = @Description,
                        MediaTag = @MediaTag,
                        ArtistID = @ArtistID,
                        AlbumID = @AlbumID
                    WHERE MediaItemID = @MediaItemID
                    AND IsDeleted = 0   
                    ";
        return await _db.ExecuteScalarAsync<int>(sql, media);
    }
    // Xoa mem 
    public async Task<int> DeleteMediaAsync(int mediaId)
    {
        string sql = @"UPDATE MediaItem
                        SET IsDeleted = 1
                        Where MediaItemID = @MediaItemID";
        return await _db.ExecuteDataAsync(sql, new {MediaItem = mediaId});
    }
    // Update file nhac     
    public async Task<int> UpdateMediaItemFilePath(int mediaID, string newfilePath)
    {
        string sql = @"UPDATE MediaItem SET filePath = @filePath WHERE MediaItemID = @MediaItemID AND IsDeleted = 0";
        return await _db.ExecuteDataAsync(sql, new {MediaItem = mediaID,  filePath = newfilePath});

    }
    public async Task<MediaItem> GetMediaInfoAsync(int mediaId)
    {
        string sql = @"SELECT 
                        m.MediaItemID, m.TitleName, m.MediaItemImage, m.Duration, m.MediaType, m.filePath, a.ArtistName
                        FROM MediaItem m
                        JOIN Artist a ON m.ArtistID = a.ArtistID
                        WHERE m.MediaItemID = @Id AND m.IsDeleted = 0";
        return await _db.LoadDataSingleAsync<MediaItem>(sql, new { MediaItem = mediaId});
    }


}
