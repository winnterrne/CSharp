using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface INotificationRepository
    {
        Task<int> CreateNotificationAsync(Notification notification);
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
        
        // Đánh dấu thông báo đã đọc (Cập nhật cột IsRead = 1)
        Task<int> MarkAsReadAsync(int notificationId); 
    }
}