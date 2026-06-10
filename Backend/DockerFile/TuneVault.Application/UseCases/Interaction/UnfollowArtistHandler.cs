using MediatR;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;

public class UnfollowArtistHandler : IRequestHandler<UnfollowArtistCommand, int>
{
    private readonly IInteractionRepository _repo;
    public UnfollowArtistHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle(UnfollowArtistCommand request, CancellationToken cancellationToken)
    {
        return await _repo.UnfollowArtistAsync(request.FollowerId, request.FollowingArtistId);
    }
}