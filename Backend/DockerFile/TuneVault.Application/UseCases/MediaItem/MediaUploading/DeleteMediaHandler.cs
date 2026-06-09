using MediatR;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public class DeleteMediaHandler : IRequestHandler<DeleteMediaCommand, bool>
{
    private readonly IMediaItemRepository _mediaRepo;

    public DeleteMediaHandler (IMediaItemRepository mediaRepo)
    {
        _mediaRepo = mediaRepo;
    }

    public async Task<bool> Handle(DeleteMediaCommand request, CancellationToken cancellationToken)
    {
        var media = await _mediaRepo.GetMediaByIdAsync(request.MediaItemID);
        if(media == null)
        {
            throw new Exception("Không tìm thấy media");
        }
        if(media.UserID != request.UserID)
        {
            throw new Exception("Bạn không có quyền xóa media này");
        }

        return await _mediaRepo.DeleteMediaAsync(request.MediaItemID) > 0;
    }
}