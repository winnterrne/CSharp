namespace TuneVault.Application.DTOs;

public record NotificationDTO(
    int NotificationID,
    string? Title,
    string? Type,
    string? Payload,
    bool IsRead,
    string? UserID  
);