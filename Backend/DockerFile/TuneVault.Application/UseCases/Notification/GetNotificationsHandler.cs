using MediatR;
using System;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;


namespace TuneVault.Application.UseCases.Notification;

public class GetNotificationsHandler
    : IRequestHandler<GetNotificationsQuery, IEnumerable<NotificationDto>>
{
    private readonly INotificationRepository _notifRepo;

    public GetNotificationsHandler(INotificationRepository notifRepo)
    {
        _notifRepo = notifRepo;
    }

    public async Task<IEnumerable<NotificationDTO>> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var notifs = await _notifRepo.GetUserNotificationsAsync(request.UserID);
        return notifs.Select(n => new NotificationDto(
            n.NotificationID,
            n.Title,
            n.Type,
            n.Payload,
            n.IsRead,
            n.UserID,
            n.NoticedAT
        ));
    }
}