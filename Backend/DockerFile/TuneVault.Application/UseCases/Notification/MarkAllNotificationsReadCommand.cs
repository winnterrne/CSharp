using MediatR;

namespace TuneVault.Application.UseCases.Notification;

public record MarkAllNotificationsReadCommand(
    string UserID
) : IRequest<bool>;