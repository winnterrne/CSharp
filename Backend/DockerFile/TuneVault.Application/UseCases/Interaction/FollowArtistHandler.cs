using MediatR;
using TuneVault.Domain.Interfaces;
namespace TuneVault.Application.UseCases.Interaction;

public class FollowArtistHandler : IRequestHandler<FollowArtistCommand, int>
{
    private readonly IInteractionRepository _repo;
    public FollowArtistHandler(IInteractionRepository repo)
    {
        _repo = repo;
    }
    public async Task<int> Handle(FollowArtistCommand request, CancellationToken cancellationToken)
    {
        var follow = new Domain.Entities.Follow
        {
            FollowerID = request.FollowerID,
            FollowingUserID = null,
            FollowingArtistID = request.ArtistID
        };
        return await _repo.FollowAsync(follow);
    }
}