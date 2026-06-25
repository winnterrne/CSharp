
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IInteractionRepository
    {
        Task<int> AddFavoriteAsync(Favorite favorite);
        Task<int> RemoveFavoriteAsync(string userId, int mediaItemId);
        Task<IEnumerable<MediaItem>> GetUserFavoritesAsync(string userId);

        Task<int> RecordPlayHistoryAsync(PlayHistory history);
        Task<IEnumerable<PlayHistory>> GetRecentPlayHistoryAsync(string userId, int limit = 10);

        Task<int> FollowAsync(Follow follow);
        Task<int> UnfollowUserAsync(string followerId, string followingUserId);
        Task<int> UnfollowArtistAsync(string followerId, int followingArtistId);

        Task<IEnumerable<Artist>> GetFollowedArtistAsync(string userID);
        Task<IEnumerable<FollowedUser>> GetFollowedUsersAsync(string userID);
        
    }
}