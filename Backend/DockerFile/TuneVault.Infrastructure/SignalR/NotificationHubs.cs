using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace TuneVault.Infrastructure.SignalR
{
    [Authorize]
    public class NotificationHub : Hub
    {
    
    }
    
}
