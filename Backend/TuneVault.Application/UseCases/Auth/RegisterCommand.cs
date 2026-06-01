using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Auth;

public record RegisterCommand(
    string UserName,
    string Email,
    string Password,
    string? Phone
) : IRequest<AuthResponseDTO>;