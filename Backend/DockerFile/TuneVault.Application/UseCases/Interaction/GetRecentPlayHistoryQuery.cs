using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Interaction;
public record GetRecentPlayHistoryQuery 
(
    string UserId,
    int Limit
): IRequest<IEnumerable<PlayHistoryDto>>;
