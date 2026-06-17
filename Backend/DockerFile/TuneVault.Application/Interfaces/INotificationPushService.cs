using TuneVault.Domain.Entities;

namespace TuneVault.Application.Interfaces
{
    public interface INotificationPushService
    {
        Task SendNotificationAsync(string userId, string message);

        // ✅ NOTIFICATION FLOW: overload để đẩy full notification
        Task SendNotificationAsync(string userId, Notification notification);
    }
}