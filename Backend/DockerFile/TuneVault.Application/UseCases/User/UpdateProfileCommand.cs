using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.User;

public record UpdateProfileCommand (
    string UserID, 
    string? UserName,
    string? UserImage,
    string? Phone,
    string? Bio
) : IRequest<UserProfileDto>;