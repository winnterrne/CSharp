using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification;

public class MarkAllNotificationsReadHandler
    : IRequestHandler<MarkAllNotificationsReadCommand, bool>
{
    private readonly INotificationRepository _notifRepo;

    public MarkAllNotificationsReadHandler(INotificationRepository notifRepo)
    {
        _notifRepo = notifRepo;
    }

    public async Task<bool> Handle(
        MarkAllNotificationsReadCommand request,
        CancellationToken cancellationToken)
    {
        return await _notifRepo.MarkAllAsReadAsync(request.UserID) > 0;
    }
}