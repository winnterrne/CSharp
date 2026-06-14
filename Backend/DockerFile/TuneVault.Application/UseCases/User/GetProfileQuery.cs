using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.User;

public record GetProfileQuery(
    string UserID
) : IRequest<UserProfileDto>;