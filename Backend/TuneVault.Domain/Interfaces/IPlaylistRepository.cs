using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IPlaylistRepository
    {
        Task<Playlist> GetPlaylistByIdAsync(string playlistId);
        Task<IEnumerable<Playlist>> GetUserPlaylistsAsync(string userId);
        Task<int> CreatePlaylistAsync(Playlist playlist);
        Task<int> UpdatePlaylistAsync(Playlist playlist);
        Task<int> DeletePlaylistAsync(string playlistId);

        // Thao tác với bảng trung gian PlaylistTrack (Chức năng 6)
        Task<int> AddTrackToPlaylistAsync(string playlistId, string songId);
        Task<int> RemoveTrackFromPlaylistAsync(string playlistId, string songId);
    }
}