using MediatR;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;
public class FollowHandler : IRequestHandler<FollowCommand, int>
{
    private readonly IInteractionRepository _repo;
    public FollowHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle (FollowCommand request, CancellationToken cancellationToken)
    {
        var follow = new Domain.Entities.Follow
        {
            FollowerID = request.FollowerID,
            FollowingUserID = request.FollowingUserID,
            FollowingArtistID = null
        };
        return await _repo.FollowAsync(follow);
    }
}