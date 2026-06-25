using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces;
    public interface IMediaItemRepository
    {
        Task<MediaItem?> GetMediaByIdAsync(int mediaId);
        Task<MediaItem> GetMediaByNameAsync(string mediaitemname);
        Task<IEnumerable<MediaItem>> GetAllMediaAsync();
        Task<IEnumerable<MediaItem>> GetMediaByUserIdAsync(string userId);
        Task<IEnumerable<MediaItem>> SearchMediaByNameAsync(string keyword);
        Task<int> CreateMediaAsync(MediaItem media);
        Task<int> UpdateMediaAsync(MediaItem media);
        Task<int> DeleteMediaAsync(int mediaId); 
        Task<MediaItem> GetMediaInfoAsync(int mediaId);
        Task<(IEnumerable<MediaItem> Items, int TotalCount)> SearchAsync(string keyword, int skip, int take);
        Task<IEnumerable<MediaItem>> GetTracksByAlbumIdAsync(int albumId);
    }
