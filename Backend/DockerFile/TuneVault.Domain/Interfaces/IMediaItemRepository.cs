using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IMediaItemRepository
    {
        public Task<MediaItem> GetMediaByIdAsync(int mediaId);
        public Task<IEnumerable<MediaItem>> GetAllMediaAsync();
        
        // Chức năng 7: Tìm kiếm theo tên bài hát
        public Task<IEnumerable<MediaItem>> SearchMediaByNameAsync(string keyword); 
        
        public Task<int> CreateMediaAsync(MediaItem media);
        public Task<int> UpdateMediaAsync(MediaItem media);
        public Task<int> DeleteMediaAsync(int mediaId); // Dùng xóa mềm (IsDelete = 1)
        public Task<MediaItem> GetMediaInfoAsync(int mediaId);
    }
}