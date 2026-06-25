using MediatR;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public record DeleteMediaCommand(
    int MediaItemID,
    string UserID   // lấy từ JWT — kiểm tra chủ sở hữu
) : IRequest<bool>;