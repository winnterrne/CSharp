using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.AI;

public class GenerateMediaDescriptionHandler
    : IRequestHandler<
        GenerateMediaDescriptionCommand,
        string>
{
    private readonly IMediaItemRepository _mediaRepo;
    private readonly IAIService _aiService;

    public GenerateMediaDescriptionHandler(
        IMediaItemRepository mediaRepo,
        IAIService aiService)
    {
        _mediaRepo = mediaRepo;
        _aiService = aiService;
    }

    public async Task<string> Handle(
        GenerateMediaDescriptionCommand request,
        CancellationToken cancellationToken)
    {
        var media =
            await _mediaRepo.GetMediaByIdAsync(
                request.MediaItemId);

        if (media == null)
            throw new Exception("Media not found");

        return await _aiService
            .GenerateDescriptionAsync(
                media.TitleName!,
                media.ArtistName!,
                media.MediaItemTag!);
    }
}