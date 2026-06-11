using MediatR;

namespace TuneVault.Application.UseCases.Notification;

public record MarkNotificationReadCommand(
    int NotificationID
) : IRequest<bool>;