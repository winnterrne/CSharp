using MediatR;
namespace TuneVault.Application.UseCases.Interaction;
public record FollowCommand(
    string FollowerID,
    string FollowingUserID
) : IRequest<int>;