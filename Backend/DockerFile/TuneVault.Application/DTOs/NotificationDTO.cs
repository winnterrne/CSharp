namespace TuneVault.Application.DTOs;

public record NotificationDto(
    int NotificationID,
    string? Title,
    string? Type,
    string? Payload,
    bool IsRead,
    string? UserID,
    DateTime NoticedAT
);