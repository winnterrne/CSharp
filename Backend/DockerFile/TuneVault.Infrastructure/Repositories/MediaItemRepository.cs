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
        string sql = @"SELECT m.*, a.ArtistName, al.AlbumName
                     FROM MediaItem m
                     LEFT JOIN Artist a ON m.ArtistID = a.ArtistID
                     LEFT JOIN Album al ON m.AlbumID = al.AlbumID
                     WHERE MediaItemID = @MediaItemID AND IsDeleted = 0";
        return await _db.LoadDataSingleAsync<MediaItem>(sql, new { MediaItemID = mediaId});
    }
    public async Task<MediaItem> GetMediaByNameAsync(string mediaitemname)
    {
        string sql = @"SELECT * FROM MediaItem WHERE TitleName = @TitleName AND IsDeleted = 0";
        return await _db.LoadDataSingleAsync<MediaItem>(sql, new { TitleName = mediaitemname});
    }
    // Query trả về 1 list dữ liệu 
    public async Task<IEnumerable<MediaItem>> GetAllMediaAsync()
    {
         var sql = @"
                    SELECT 
                        m.*,
                        a.ArtistName,
                        al.AlbumName
                    FROM MediaItem m
                    LEFT JOIN Artist a ON m.ArtistID = a.ArtistID
                    LEFT JOIN Album al ON m.AlbumID = al.AlbumID
                    WHERE m.IsDeleted = 0";
        return await _db.LoadAllDataSingleAsync<MediaItem>(sql);
    }

    public async Task<IEnumerable<MediaItem>> GetMediaByUserIdAsync(string userID) {
         var sql = @"
                    SELECT 
                        m.*,
                        a.ArtistName,
                        al.AlbumName
                    FROM MediaItem m
                    LEFT JOIN Artist a ON m.ArtistID = a.ArtistID
                    LEFT JOIN Album al ON m.AlbumID = al.AlbumID
                    WHERE m.UserID = @UserID 
                    AND m.IsDeleted = 0
                    ORDER BY m.UploadAT DESC";
        return await _db.LoadAllDataSingleAsync<MediaItem> (sql, new {UserID = userID});
    }

    public async Task<IEnumerable<MediaItem>> GetTracksByAlbumIdAsync(int albumId)
    {
        string sql = @"
            SELECT * FROM MediaItem 
            WHERE AlbumID = @AlbumID AND IsDeleted = 0";

        return await _db.LoadAllDataSingleAsync<MediaItem>(sql, new { AlbumID = albumId });
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
        string sql = @"
        INSERT INTO MediaItem 
        (
            TitleName, MediaItemImage, filePath, MediaItemTag, MediaItemType, 
            Duration, UploadAT, Description, ArtistID, AlbumID, UserID, IsDeleted 
        )
        OUTPUT INSERTED.MediaItemID   
        VALUES 
        (
            @TitleName, 
            @MediaItemImage, 
            CASE 
                WHEN @filePath LIKE '%_%' THEN 
                    RIGHT(@filePath, CHARINDEX('_', REVERSE(@filePath)) - 1)
                ELSE 
                    RIGHT(@filePath, CHARINDEX('/', REVERSE(REPLACE(@filePath, '\', '/'))) - 1)
            END, 
            @MediaItemTag, 
            @MediaItemType, 
            @Duration, 
            @UploadAt, 
            @Description, 
            @ArtistID, 
            @AlbumID, 
            @UserID,
            0 
        )";
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
        return await _db.ExecuteDataAsync(sql, new {MediaItemID = mediaId});
    }
    // Update file nhac     
    public async Task<int> UpdateMediaItemFilePath(int mediaID, string newfilePath)
    {
        string sql = @"UPDATE MediaItem SET filePath = @filePath WHERE MediaItemID = @MediaItemID AND IsDeleted = 0";
        return await _db.ExecuteDataAsync(sql, new {MediaItemID = mediaID,  filePath = newfilePath});

    }
    public async Task<MediaItem> GetMediaInfoAsync(int mediaId)
    {
        string sql = @"SELECT 
                        m.MediaItemID, m.TitleName, m.MediaItemImage, m.Duration, m.MediaItemType, m.filePath, a.ArtistName
                        FROM MediaItem m
                        JOIN Artist a ON m.ArtistID = a.ArtistID
                        WHERE m.MediaItemID = @MediaItemID AND m.IsDeleted = 0";
        return await _db.LoadDataSingleAsync<MediaItem>(sql, new { MediaItemID = mediaId});
    }

    public async Task<(IEnumerable<MediaItem> Items, int TotalCount)> SearchAsync(string keyword, int skip, int take)
    {
        string dataSql = @"
            SELECT * FROM MediaItem 
            WHERE TitleName LIKE @keyword AND IsDeleted = 0
            ORDER BY TitleName ASC
            OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        string countSql = @"
            SELECT COUNT(*) FROM MediaItem 
            WHERE TitleName LIKE @keyword AND IsDeleted = 0";

        var parameters = new { Keyword = $"%{keyword}%", skip, take };

        var items = await _db.LoadAllDataSingleAsync<MediaItem>(dataSql, parameters);
        var totalCount = await _db.ExecuteScalarAsync<int>(countSql, parameters);

        return (items, totalCount);
    }


}
