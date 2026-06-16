using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Infrastructure.Dapper;
using Dapper;
namespace TuneVault.Infrastructure.Repositories
{
    public class InteractionRepository : IInteractionRepository
    {
        private readonly DataContextDapper _db;
        public InteractionRepository(DataContextDapper db)
        {
            _db = db;
        }
    // Chức năng 9: Yêu thích (Favorite)
        // Thêm yêu thích
        public async Task<int> AddFavoriteAsync(Favorite favorite)
        {
            string sql = @"IF NOT EXISTS (SELECT 1 FROM Favorite WHERE UserID = @UserID AND MediaItemID = @MediaItemID)
                            BEGIN
                                    INSERT INTO Favorite (UserID, MediaItemID) VALUES (@UserID, @MediaItemID)
                            END";
            return await _db.ExecuteDataAsync(sql, favorite);
        }
        //Hủy yêu thích (Unfavorite)
        public async Task<int> RemoveFavoriteAsync(string userId, int mediaItemId)
        {
            string sql = @"DELETE FROM Favorite
                            WHERE UserID= @UserID AND MediaItemID = @MediaItemID";
            return await _db.ExecuteDataAsync(sql, new {UserID = userId, MediaItemID = mediaItemId });
        }
        // Lấy danh sách yêu thích của người dùng
        public async Task<IEnumerable<MediaItem>> GetUserFavoritesAsync(string userId)
        {
            string sql = @"SELECT 
                            m.*, 
                            a.ArtistName
                        FROM MediaItem m
                        INNER JOIN Favorite f ON m.MediaItemID = f.MediaItemID
                        LEFT JOIN Artist a ON m.ArtistID = a.ArtistID 
                        WHERE f.UserID = @UserID";

            return await _db.LoadAllDataSingleAsync<MediaItem>(sql, new {UserID = userId});
        }

    //Chức năng 10: Lịch sử
        //Ghi lại lịch sử nghe nhạc của người dùng
        public async Task<int> RecordPlayHistoryAsync(PlayHistory history)
        {
            string sql = @"
                            INSERT INTO PlayHistory (UserID, MediaItemID, PlayedAt)
                            OUTPUT INSERTED.HistoryID 
                            VALUES (@UserID, @MediaItemID, @PlayedAt)";
            return await _db.ExecuteScalarAsync<int>(sql, new 
            { 
                UserID = history.UserID,         
                MediaItemID = history.MediaItemID, 
                PlayedAt = history.PlayedAt 
            });
        }
        //Lấy 10 bài mới nhất trong lịch sử nghe nhạc của người dùng
        public async Task<IEnumerable<PlayHistory>> GetRecentPlayHistoryAsync(string userId, int limit = 10)
        {
            string sql = @"SELECT TOP (@Limit) p.historyID, p.UserID, p.MediaItemID, p.PlayedAt, m.TitleName, m.MediaItemID, m.MediaItemImage 
                        FROM PlayHistory as p
                        INNER JOIN MediaItem m on p.MediaItemID = m.MediaItemID
                        WHERE p.UserID = @UserID
                        ORDER BY p.PlayedAt DESC";
            using var con = _db.CreateConnection();
            var result = await con.QueryAsync<PlayHistory, MediaItem, PlayHistory>(sql, (history, media) => 
            {
                history.MediaItem = media;
                return history;
            }, new { UserID = userId, Limit = limit }, splitOn: "MediaItemID");
            return result;
        }

    // Chức năng: Theo dõi (Follow)
        //Theo dõi nghệ sĩ hoặc người dùng khác
        public async Task<int> FollowAsync(Follow follow)
        {
            string sql = @"IF NOT EXISTS (
                            SELECT 1 FROM Follow 
                            WHERE FollowerID = @FollowerID 
                            AND (FollowingUserID = @FollowingUserID OR (FollowingUserID IS NULL AND @FollowingUserID IS NULL))
                            AND (FollowingArtistID = @FollowingArtistID OR (FollowingArtistID IS NULL AND @FollowingArtistID IS NULL))
                        )
                        BEGIN
                            INSERT INTO Follow (FollowerID, FollowingUserID, FollowingArtistID)
                            OUTPUT INSERTED.FollowID
                            VALUES (@FollowerID, @FollowingUserID, @FollowingArtistID)
                        END";
            return await _db.ExecuteScalarAsync<int>(sql, follow);
        }
        //Hủy theo dõi nghệ sĩ hoặc người dùng khác
            // 1. Hàm hủy theo dõi User
        public async Task<int> UnfollowUserAsync(string followerId, string followingUserId)
        {
            string sql = @"DELETE FROM Follow 
                        WHERE FollowerID = @FollowerID AND FollowingUserID = @FollowingUserID";
            return await _db.ExecuteDataAsync(sql, new { FollowerID = followerId, FollowingUserID = followingUserId });
        }

            // 2. Hàm hủy theo dõi Artist
        public async Task<int> UnfollowArtistAsync(string followerId, int followingArtistId)
        {
            string sql = @"DELETE FROM Follow 
                        WHERE FollowerID = @FollowerID AND FollowingArtistID = @FollowingArtistId";
            return await _db.ExecuteDataAsync(sql, new { FollowerID = followerId, FollowingArtistId = followingArtistId });
        }
        //
         public async Task<IEnumerable<Artist>> GetFollowedArtistAsync(string userID)
        {
            string sql = @"
                SELECT 
                    a.ArtistID,
                    a.ArtistName,
                    a.ArtistImage
                FROM Follow f
                INNER JOIN Artist a
                    ON f.FollowingArtistID = a.ArtistID
                WHERE f.FollowerID = @UserID
            ";
            return await _db.LoadAllDataSingleAsync<Artist>(sql, new {UserID = userID});
        }
    }
}