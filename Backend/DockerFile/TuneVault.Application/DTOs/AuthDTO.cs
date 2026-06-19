namespace TuneVault.Application.DTos;
public record RegisterRequestDto (
    string UserName,
    string Email,
    string Password,
    string? Phone
);

public record LoginRequestDto (
    string Email,
    string Password
);

public record AuthResponseDto (
    string UserID,
    string UserName,
    string Email,
    string Role,
    string Token,
    string? UserImage
);

public record UserProfileDto (
    string UserID, 
    string? UserName, 
    string? UserImage,
    string? Email, 
    string? Role,
    string? Phone,
    string? Bio
);

public record UpdateProfileDto (
    string? UserName,
    string? UserImage,
    string? Phone,
    string? Bio
);