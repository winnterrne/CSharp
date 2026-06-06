using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Notification;

public record GetNotificationsQuery(
    string UserID
) : IRequest<IEnumerable<NotificationDto>>;