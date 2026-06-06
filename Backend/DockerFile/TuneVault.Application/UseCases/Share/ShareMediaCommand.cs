using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Share;

public record ShareMediaCommand (
    string SenderID,
    string ReceiverID,
    int? MediaItemID,
    int? PlaylistID
) : IRequest<ShareMediaResponseDto>;