using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IPlaylistRepository
    {
        Task<(Playlist Playlist, IEnumerable<MediaItem> Songs)> GetPlaylistByIdAsync(int playlistID);
        Task<(IEnumerable<Playlist> Playlists, Dictionary<int, int> TrackCounts)> GetUserPlaylistsAsync(string userId);
        Task<(IEnumerable<Playlist> Playlists, Dictionary<int, int> TrackCounts)> GetPublicUserPlaylistsAsync(string userId);
        Task<int> CreatePlaylistAsync(Playlist playlist);
        Task<int> UpdatePlaylistAsync(Playlist playlist);
        Task<int> DeletePlaylistAsync(int playlistId);

        // Thao tác với bảng trung gian PlaylistTrack (Chức năng 6)
        
        Task<int> AddTrackToPlaylistAsync(int playlistId, int mediaItemId);
        Task<int> RemoveTrackFromPlaylistAsync(int playlistId, int mediaItemId);
        Task<IEnumerable<MediaItem>> GetTracksByPlaylistIdAsync(int playlistId);
        Task<(IEnumerable<Playlist> Playlists, int TotalCount)> SearchAsync(string keyword, int skip, int take);
    }
}