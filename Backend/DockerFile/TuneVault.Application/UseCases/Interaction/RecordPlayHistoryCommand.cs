using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Interaction;

public record RecordPlayHistoryCommand(
    string UserID,
    int MediaItemID
) : IRequest<int>;