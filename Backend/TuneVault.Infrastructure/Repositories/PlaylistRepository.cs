using TuneVault.Infrastructure.Dapper;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Infrastructure.Repositories;

public class PlaylistRepository : IPlaylistRepository
{
    private readonly DataContextDapper _db;

        public PlaylistRepository(DataContextDapper db)
        {
            _db = db;
        }

    public async Task<Playlist> GetPlaylistByIdAsync(int playlistID)
    {
        string sql = "SELECT * FROM TuneVault.PlayList WHERE PlaylistID = @PlaylistID AND IsDeleted = 0";
        return await _db.LoadDataSingleAsync<Playlist> (sql, new {PlaylistID = playlistID});
    }

    public async Task<IEnumerable<Playlist>> GetUserPlaylistsAsync(string userId)
    {
        string sql = "SELECT * FROM TuneVault.Playlist WHERE UserID = @userId AND IsDeleted = 0";
        return await _db.LoadAllDataSingleAsync<Playlist> (sql, new {UserID = userId});
    }

    public async Task<int> CreatePlaylistAsync(Playlist playlist) {
        string sql = @"INSERT INTO TuneVault.Playlist 
                            (PlaylistID, PlaylistName, IsPublic, Description, UserID, IsDeleted)
                        OUTPUT INSERTED.PlaylistID
                        VALUES 
                            (@PlaylistID, @PlaylistName, @IsPublic, @Description, @UserID, 0)";
        return await _db.ExecuteScalarAsync<int>(sql, playlist);
    }
    public async Task<int> UpdatePlaylistAsync(Playlist playlist) {
        string sql = @"UPDATE TuneVault.Playlist
                        SET PlaylistName = @PlaylistName,
                        IsPublic = @IsPublic,
                        Description = @Description
                        WHERE PlaylistID = @PlaylistID AND IsDeleted = 0";
        return await _db.ExecuteDataAsync(sql, playlist);
    }
    public async Task<int> DeletePlaylistAsync(int playlistId) {
        string sql = @"UPDATE TuneVault.Playlist
                        SET IsDeleted = 1
                        WHERE PlaylistID = @PlaylistID";
        return await _db.ExecuteDataAsync(sql, new {PlaylistID = playlistId});
    }

    // Thao tác với bảng trung gian PlaylistTrack (Chức năng 6)
    public async Task<int> AddTrackToPlaylistAsync(int playlistId, int mediaItemID) {
        string sql = @"INSERT INTO TuneVault.PlaylistTrack
                            (PlaylistID, MediaItemID)
                        VALUES (@PlaylistID, @MediaItemID)";
        return await _db.ExecuteDataAsync(sql, new {PlaylistID = playlistId, MediaItemID = mediaItemID});
    }
    public async Task<int> RemoveTrackFromPlaylistAsync(int playlistId, int mediaItemID) {
        string sql = @"DELETE FROM TuneVault.PlaylistTrack
                        WHERE PlaylistID = @PlaylistID AND MediaItemID = @MediaItemID";
        return await _db.ExecuteDataAsync(sql, new {PlaylistID = playlistId, MediaItemID = mediaItemID});
    }

}