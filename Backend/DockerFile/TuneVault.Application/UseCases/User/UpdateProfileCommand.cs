using MediatR;
using TuneVault.Application.DTos;
using Microsoft.AspNetCore.Http;

namespace TuneVault.Application.UseCases.User;

public record UpdateProfileCommand (
    string UserID, 
    string? UserName,
    IFormFile? Avatar,
    string? Phone,
    string? Bio
) : IRequest<UserProfileDto>;