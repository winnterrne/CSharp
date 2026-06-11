using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases;

public record SearchMediaQuery(
    string KeyWord=" ",
    int PageNumber=1,
    int PageSize=10
) : IRequest<SearchResultDto>;