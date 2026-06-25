using Microsoft.AspNetCore.SignalR;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Infrastructure.SignalR;

namespace TuneVault.Infrastructure.Services;

public class SignalRNotificationService : INotificationPushService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationService(
        IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(
        string userId,
        string message)
    {
        await _hubContext
            .Clients
            .Group(userId)
            .SendAsync("ReceiveNotificationMessage", message);
    }

    // ✅ NOTIFICATION FLOW: gửi full notification realtime về FE
    public async Task SendNotificationAsync(
        string userId,
        Notification notification)
    {
        await _hubContext
            .Clients
            .Group(userId)
            .SendAsync("ReceiveNotification", notification);
    }
}