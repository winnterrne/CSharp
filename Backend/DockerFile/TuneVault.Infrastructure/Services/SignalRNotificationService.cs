using Microsoft.AspNetCore.SignalR;
using TuneVault.Application.Interfaces;
using TuneVault.Infrastructure.SignalR;

namespace TuneVault.Infrastructure.Services
{
    public class SignalRNotificationService : INotificationPushService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }
    
        // ReceiveNotification: event name frontend phải có tên giống Backend
        public async Task SendNotificationAsync(string userId, string message)
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", new
            {
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }
    
    }
}