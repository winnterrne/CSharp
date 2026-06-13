using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Playhistory;

public class RecordPlayHistoryCommandHandler : IRequestHandler<RecordPlayHistoryCommand>
{
    private readonly IInteractionRepository _playHistory;
    public RecordPlayHistoryCommandHandler(IInteractionRepository playHistory)
    {
        _playHistory = playHistory;
    }

    public async Task Handle(RecordPlayHistoryCommand request, CancellationToken cancellationToken)
    {
        var history = new PlayHistory
        (
            userID: request.userID,
            mediaItemID: request.MediaItemID,
            playedAt: DateTime.UtcNow
        );
        await _playHistory.RecordPlayHistoryAsync(history);
    }
}