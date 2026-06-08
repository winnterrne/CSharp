using MediatR;
namespace TuneVault.Application.UseCases.Interaction;

public record FollowArtistCommand(
    string FollowerID,
    int ArtistID
) : IRequest<int>;