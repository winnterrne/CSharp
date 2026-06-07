using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Interaction;
public class GetRecentPlayHistoryQuery : IRequest<IEnumerable<PlayHistoryDTO>>
{
    public string UserId { get; set; }
    public int Limit { get; set; }

    public GetRecentPlayHistoryQuery(string userId, int limit = 10)
    {
        UserId = userId;
        Limit = limit;
    }
}