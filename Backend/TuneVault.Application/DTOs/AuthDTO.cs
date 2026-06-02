namespace TuneVault.Application.DTOs;
public record RegisterRequestDTO (
    string UserName,
    string Email,
    string Password,
    string? Phone
);

public record LoginRequestDTO (
    string Email,
    string Password
);

public record AuthResponseDTO (
    string UserID,
    string UserName,
    string Email,
    string Role,
    string Token
);

public record UserProfileDTO (
    string UserID, 
    string? UserName, 
    string? UserImage,
    string? Email, 
    string? Role,
    string? Phone
);

public record UpdateProfileDTO (
    string? UserName,
    string? UserImage,
    string? Phone
);