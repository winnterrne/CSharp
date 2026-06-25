using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TuneVault.Infrastructure.SignalR
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId =
                Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!string.IsNullOrWhiteSpace(userId))
            {
                // ✅ NOTIFICATION FLOW: mỗi user vào group theo UserID
                await Groups.AddToGroupAsync(
                    Context.ConnectionId,
                    userId
                );
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId =
                Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.RemoveFromGroupAsync(
                    Context.ConnectionId,
                    userId
                );
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}