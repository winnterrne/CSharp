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
        Task<int> MarkAsReadAsync(int notificationId); 
        Task<int> MarkAllAsReadAsync(string userId);
    }
}