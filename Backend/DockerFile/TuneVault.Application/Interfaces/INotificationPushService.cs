using TuneVault.Domain.Entities;

namespace TuneVault.Application.Interfaces
{
    public interface INotificationPushService
    {
        Task SendNotificationAsync(string userId, string message);
        Task SendNotificationAsync(string userId, Notification notification);
    }
}