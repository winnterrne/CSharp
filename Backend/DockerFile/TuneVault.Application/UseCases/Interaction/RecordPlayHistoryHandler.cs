using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Interaction;

public class RecordPlayHistoryHandler : IRequestHandler<RecordPlayHistoryCommand, int>
{
    private readonly IInteractionRepository _playHistory;
    public RecordPlayHistoryHandler(IInteractionRepository playHistory)
    {
        _playHistory = playHistory;
    }

    public async Task<int> Handle(RecordPlayHistoryCommand request, CancellationToken cancellationToken)
    {
        var history = new PlayHistory
        (
            request.UserID,
            request.MediaItemID,   
            DateTime.UtcNow
        );
        var historyID = await _playHistory.RecordPlayHistoryAsync(history);
        return historyID;
    }
}
