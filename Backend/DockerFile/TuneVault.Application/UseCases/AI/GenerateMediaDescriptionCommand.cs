using MediatR;

namespace TuneVault.Application.UseCases.AI;

public record GenerateMediaDescriptionCommand(
    int MediaItemId
) : IRequest<string>;