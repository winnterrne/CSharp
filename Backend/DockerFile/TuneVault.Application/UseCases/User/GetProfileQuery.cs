using MediatR;
using TuneVault.Application.Dtos;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.User;

public record GetProfileQuery(
    string UserID
) : IRequest<UserProfileDto>;