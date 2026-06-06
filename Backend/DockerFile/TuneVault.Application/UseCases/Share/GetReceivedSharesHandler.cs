using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Share;

public class GetReceivedSharesHandler : IRequestHandler<GetReceivedSharesQuery, IEnumerable<ShareMediaResponseDto>>
{
    private readonly IShareRepository _shareRepo;

    public GetReceivedSharesHandler(IShareRepository shareRepo)
    {
        _shareRepo = shareRepo;
    }

    public async Task<IEnumerable<ShareMediaResponseDto>> Handle( 
    GetReceivedSharesQuery request, CancellationToken cancellationToken)
    {
        var shares = await _shareRepo.GetSharedWithMeAsync(request.UserID);
        return shares.Select(s => new ShareMediaResponseDto(
            s.ShareID,
            s.SenderID,
            s.ReceiverID!,
            s.MediaItemID,
            s.PlaylistID,
            s.SharedAt
        ));
    }
}