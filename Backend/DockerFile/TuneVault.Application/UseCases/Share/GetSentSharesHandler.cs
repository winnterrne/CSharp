using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Share;

public class GetSentSharesHandler
    : IRequestHandler<GetSentSharesQuery, IEnumerable<ShareMediaResponseDto>>
{
    private readonly IShareRepository _shareRepo;

    public GetSentSharesHandler(IShareRepository shareRepo)
    {
        _shareRepo = shareRepo;
    }

    public async Task<IEnumerable<ShareMediaResponseDto>> Handle( 
        GetSentSharesQuery request,
        CancellationToken cancellationToken)
    {
        var shares = await _shareRepo.GetSharedByMeAsync(request.UserID);

        return shares.Select(s => new ShareMediaResponseDto(
            s.ShareID,
            s.SenderID!,
            s.ReceiverID!,
            s.MediaItemID,
            s.PlaylistID,
            s.SharedAt
        ));
    }
}