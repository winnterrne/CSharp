using MediatR;

namespace TuneVault.Application.UseCases.Interaction;
public record RemoveFavoriteCommand (
    string UserID,
    int MediaItemID
) : IRequest<int>;