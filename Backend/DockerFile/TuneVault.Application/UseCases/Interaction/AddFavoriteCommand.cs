using MediatR;

namespace TuneVault.Application.UseCases.Interaction;
public record AddFavoriteCommand (
    string UserID,
    int MediaItemID
) : IRequest<int>;
