namespace TuneVault.Application.Interfaces
{
    public interface INotificationPushService
    {
        Task SendNotificationAsync(string userId, string message);
    }
}