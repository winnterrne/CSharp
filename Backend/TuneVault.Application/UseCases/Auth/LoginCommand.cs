using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Auth;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResponseDTO>;