using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases;

public record SearchUserQuery(
    string Keyword = " ",
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<IEnumerable<UserProfileDto>>;
