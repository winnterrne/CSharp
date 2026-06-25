using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public record UpdateMediaCommand
(
    int MediaItemID,
    string UserID,          // lấy từ JWT — kiểm tra chủ sở hữu
    string? TitleName,
    string? Description,
    string? MediaItemTag,
    string? MediaItemImage,
    int? ArtistID,
    int? AlbumID
) : IRequest<MediaItemDto>;