
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Share;

public record GetReceivedSharesQuery (
    string UserID
) : IRequest<IEnumerable<ShareMediaResponseDto>>;