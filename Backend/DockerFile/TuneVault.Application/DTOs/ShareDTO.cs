namespace TuneVault.Application.DTOs;

public record ShareMediaRequestDto
(
    string ReceiverID,
    int? MediaItemID,
    int? PlaylistID
);

public record ShareMediaResponseDto(
    int ShareID,
    string SenderID,
    string ReceiverID,
    int? MediaItemID,
    int? PlaylistID,
    DateTime SharedAt
);

// Trả về thông báo
public record NotificationDto(
    int NotificationID,
    string? Title,
    string? Type,
    string? Payload,
    bool IsRead,
    string? UserID
);