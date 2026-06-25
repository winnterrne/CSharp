using TuneVault.Infrastructure.Dapper;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Application.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class PlaylistRepository : IPlaylistRepository
{
    private readonly DataContextDapper _db;

        public PlaylistRepository(DataContextDapper db)
        {
            _db = db;
        }

    public async Task<(Playlist Playlist, IEnumerable<MediaItem> Songs)> GetPlaylistByIdAsync(int playlistID)
    {
        string playlistSql = @"
            SELECT *
            FROM Playlist
            WHERE PlaylistID = @PlaylistID
            AND IsDeleted = 0;
        ";

        string songsSql = @"
            SELECT
                m.MediaItemID,
                m.TitleName,
                m.FilePath,
                m.MediaItemImage,
                m.MediaItemTag,
                m.MediaItemType,
                m.Duration,
                m.Description,
                m.ArtistID,
                a.ArtistName AS ArtistName,
                m.AlbumID,
                al.AlbumName AS AlbumName,
                m.UserID,
                m.UploadAt
            FROM PlaylistTrack pt
            INNER JOIN MediaItem m ON m.MediaItemID = pt.MediaItemID
            LEFT JOIN Artist a ON a.ArtistID = m.ArtistID
            LEFT JOIN Album al ON al.AlbumID = m.AlbumID
            WHERE pt.PlaylistID = @PlaylistID;
        ";

        var parameters = new { PlaylistID = playlistID };

        var playlist = await _db.LoadDataSingleAsync<Playlist>(
            playlistSql,
            parameters
        );

        var songs = await _db.LoadAllDataSingleAsync<MediaItem>(
            songsSql,
            parameters
        );

        return (playlist, songs);
    }

    public async Task<(IEnumerable<Playlist> Playlists, Dictionary<int, int> TrackCounts)> GetPublicUserPlaylistsAsync(string userId)
    {
        string sql = @"
            SELECT *
            FROM Playlist
            WHERE UserID = @UserID
            AND IsPublic = 1
            AND IsDeleted = 0
            ORDER BY PlaylistID DESC;
        ";

        string countSql = @"
            SELECT 
                p.PlaylistID,
                COUNT(pt.MediaItemID) AS TrackCount
            FROM Playlist p
            LEFT JOIN PlaylistTrack pt ON pt.PlaylistID = p.PlaylistID
            WHERE p.UserID = @UserID
            AND p.IsPublic = 1
            AND p.IsDeleted = 0
            GROUP BY p.PlaylistID;
        ";

        var parameters = new { UserID = userId };

        var playlists = await _db.LoadAllDataSingleAsync<Playlist>(sql, parameters);
        var counts = await _db.LoadAllDataSingleAsync<PlaylistTrackCountDto>(countSql, parameters);
        var trackCounts = counts.ToDictionary(x => x.PlaylistID, x => x.TrackCount);

        return (playlists, trackCounts);
    }

    public async Task<(IEnumerable<Playlist> Playlists, Dictionary<int, int> TrackCounts)> GetUserPlaylistsAsync(string userId)
    {
        string sql = @"
            SELECT *
            FROM Playlist
            WHERE UserID = @UserID
            AND IsDeleted = 0
            ORDER BY PlaylistID DESC;
        ";

        string countSql = @"
            SELECT 
                p.PlaylistID,
                COUNT(pt.MediaItemID) AS TrackCount
            FROM Playlist p
            LEFT JOIN PlaylistTrack pt ON pt.PlaylistID = p.PlaylistID
            WHERE p.UserID = @UserID
            AND p.IsDeleted = 0
            GROUP BY p.PlaylistID;
        ";

        var parameters = new { UserID = userId };

        var playlists = await _db.LoadAllDataSingleAsync<Playlist>(sql, parameters);

        var counts = await _db.LoadAllDataSingleAsync<PlaylistTrackCountDto>(
            countSql,
            parameters
        );

        var trackCounts = counts.ToDictionary(
            x => x.PlaylistID,
            x => x.TrackCount
        );

        return (playlists, trackCounts);
    }    
    public async Task<int> CreatePlaylistAsync(Playlist playlist) {
        string sql = @"INSERT INTO Playlist 
                            (PlaylistName, IsPublic, Description, UserID, IsDeleted)
                        OUTPUT INSERTED.PlaylistID
                        VALUES 
                            (@PlaylistName, @IsPublic, @Description, @UserID, 0)";
        return await _db.ExecuteScalarAsync<int>(sql, playlist);
    }
    public async Task<int> UpdatePlaylistAsync(Playlist playlist) {
        string sql = @"UPDATE Playlist
                        SET PlaylistName = @PlaylistName,
                        IsPublic = @IsPublic,
                        Description = @Description
                        WHERE PlaylistID = @PlaylistID AND IsDeleted = 0";
        return await _db.ExecuteDataAsync(sql, playlist);
    }
    public async Task<int> DeletePlaylistAsync(int playlistId) {
        string sql = @"UPDATE Playlist
                        SET IsDeleted = 1
                        WHERE PlaylistID = @PlaylistID";
        return await _db.ExecuteDataAsync(sql, new {PlaylistID = playlistId});
    }

    // Thao tác với bảng trung gian PlaylistTrack (Chức năng 6)
    public async Task<int> AddTrackToPlaylistAsync(int playlistId, int mediaItemID) {
        string sql = @"INSERT INTO PlaylistTrack
                            (PlaylistID, MediaItemID)
                        VALUES (@PlaylistID, @MediaItemID)";
        return await _db.ExecuteDataAsync(sql, new {PlaylistID = playlistId, MediaItemID = mediaItemID});
    }
    public async Task<int> RemoveTrackFromPlaylistAsync(int playlistId, int mediaItemID) {
        string sql = @"DELETE FROM PlaylistTrack
                        WHERE PlaylistID = @PlaylistID AND MediaItemID = @MediaItemID";
        return await _db.ExecuteDataAsync(sql, new {PlaylistID = playlistId, MediaItemID = mediaItemID});
    }

    public async Task<(IEnumerable<Playlist> Playlists, int TotalCount)> SearchAsync(string keyword, int skip, int take)
    {
        string sql = @"
            SELECT * FROM Playlist 
            WHERE PlaylistName LIKE @keyword AND IsPublic = 1 AND IsDeleted = 0
            ORDER BY PlaylistName ASC
            OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY";

        string countSql = @"
            SELECT COUNT(*) FROM Playlist 
            WHERE PlaylistName LIKE @keyword AND IsDeleted = 0";

        var parameters = new { Keyword = $"%{keyword}%", skip, take };

        var playlists = await _db.LoadAllDataSingleAsync<Playlist>(sql, parameters);
        var totalCount = await _db.ExecuteScalarAsync<int>(countSql, parameters);

        return (playlists, totalCount);
    }

    public async Task<IEnumerable<MediaItem>> GetTracksByPlaylistIdAsync(int playlistId)
    {
        string sql = @"
        SELECT m.*
        FROM PlaylistTrack pt
        INNER JOIN MediaItem m
            ON pt.MediaItemID = m.MediaItemID
        WHERE pt.PlaylistID = @PlaylistID";

        return await _db.LoadAllDataSingleAsync<MediaItem>(
            sql,
            new
            {
                PlaylistID = playlistId
            });

    }
}