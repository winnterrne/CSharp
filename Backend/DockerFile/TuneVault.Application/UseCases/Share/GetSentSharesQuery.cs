using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Share;

public record GetSentSharesQuery(
    string UserID
) : IRequest<IEnumerable<ShareMediaResponseDto>>;