using MediatR;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
namespace TuneVault.Application.UseCases.Interaction;

public class RecordPlayHistoryHandler : IRequestHandler<RecordPlayHistoryCommand, int>
{
    private readonly IInteractionRepository _repo;
    public RecordPlayHistoryHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle(RecordPlayHistoryCommand request, CancellationToken cancellationToken)
    {
        var result = new PlayHistory(
            request.UserID,
            request.MediaItemID,
            DateTime.UtcNow
        );
    return await _repo.RecordPlayHistoryAsync(result);
        
    }
}
