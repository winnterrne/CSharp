using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Interaction;
public class UnfollowUserHandler : IRequestHandler<UnfollowUserCommand, int>
{
    private readonly IInteractionRepository _repo;
    public UnfollowUserHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle(UnfollowUserCommand request, CancellationToken cancellationToken)
    {
        return await _repo.UnfollowUserAsync(request.FollowerId, request.FollowingUserId);
    }
}