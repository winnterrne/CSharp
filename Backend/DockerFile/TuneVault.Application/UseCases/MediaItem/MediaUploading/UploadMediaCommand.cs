using MediatR;
using Microsoft.AspNetCore.Http;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.MediaItem.MediaUploading;

public record UploadMediaCommand(
    string TitleName,
    string? Description,
    string? MediaItemTag,
    string MediaItemType,
    int? Duration,
    int? ArtistID,
    int? AlbumID,
    string UserID,          // lấy từ JWT token
    IFormFile File          // file mp3/mp4
) : IRequest<MediaItemDto>;