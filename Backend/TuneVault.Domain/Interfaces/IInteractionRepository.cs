using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IInteractionRepository
    {
        // Chức năng 10: Yêu thích bài hát
        Task<int> AddFavoriteAsync(Favorite favorite);
        Task<int> RemoveFavoriteAsync(string userId, string songId);
        Task<IEnumerable<MediaItem>> GetUserFavoritesAsync(string userId);

        // Chức năng 10: Lịch sử nghe nhạc (Lấy 10 bài mới nhất)
        Task<int> RecordPlayHistoryAsync(PlayHistory history);
        Task<IEnumerable<PlayHistory>> GetRecentPlayHistoryAsync(string userId, int limit = 10);

        // Theo dõi (Follow)
        Task<int> FollowAsync(Follow follow);
        Task<int> UnfollowAsync(string followerId, string followingId);
    }
}