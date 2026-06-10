using MediatR;
namespace TuneVault.Application.UseCases.Interaction;

public record UnfollowUserCommand(
    string FollowerId,
    string FollowingUserId
) : IRequest<int>;