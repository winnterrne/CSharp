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

