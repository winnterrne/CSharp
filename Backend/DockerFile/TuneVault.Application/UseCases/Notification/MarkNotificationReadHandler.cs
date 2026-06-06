using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification;

public class MarkNotificationReadHandler
    : IRequestHandler<MarkNotificationReadCommand, bool>
{
    private readonly INotificationRepository _notifRepo;

    public MarkNotificationReadHandler(INotificationRepository notifRepo)
    {
        _notifRepo = notifRepo;
    }

    public async Task<bool> Handle(
        MarkNotificationReadCommand request,
        CancellationToken cancellationToken)
    {
        return await _notifRepo.MarkAsReadAsync(request.NotificationID) > 0; 
    }
}