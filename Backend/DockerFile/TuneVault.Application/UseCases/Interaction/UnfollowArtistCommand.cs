using MediatR;
namespace TuneVault.Application.UseCases.Interaction;
public record UnfollowArtistCommand (
    string FollowerId,
    int FollowingArtistId
) : IRequest<int>;