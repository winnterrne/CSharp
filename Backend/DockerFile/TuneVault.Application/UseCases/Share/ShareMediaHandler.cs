using System.Text.Json;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;
using TuneVault.Application.Interfaces;

namespace TuneVault.Application.UseCases.Share;

public class ShareMediaHandler : IRequestHandler<ShareMediaCommand, ShareMediaResponseDto>
{
    private readonly IShareRepository _shareRepo;
    private readonly INotificationRepository _notifRepo;
    private readonly IUserRepository _userRepo;
    private readonly INotificationPushService _pushService;

    public ShareMediaHandler(
        IShareRepository shareRepo,
        INotificationRepository notifRepo,
        IUserRepository userRepo,
        INotificationPushService pushService)
    {
        _shareRepo = shareRepo;
        _notifRepo = notifRepo;
        _userRepo = userRepo;
        _pushService = pushService;
    }

    public async Task<ShareMediaResponseDto> Handle (
        ShareMediaCommand request,
        CancellationToken cancellationToken
    )
    {
        var receiver = await _userRepo.GetUserByIdAsync(request.ReceiverID);
        if(receiver == null) throw new Exception("Người nhận không tồn tại");

        if (request.MediaItemID == null && request.PlaylistID == null)
            throw new Exception("Phải chọn bài hát/video hoặc playlist để chia sẻ");

        if (request.MediaItemID != null && request.PlaylistID != null)
            throw new Exception("Chỉ được chia sẻ một loại nội dung");

        var alreadyShared = await _shareRepo.AlreadySharedAsync(
            request.SenderID, request.ReceiverID,
            request.MediaItemID, request.PlaylistID);
        if (alreadyShared)
            throw new Exception("Bạn đã chia sẻ nội dung này rồi");

        var share = new MediaShare
        {
            ShareID     = 0,
            SenderID    = request.SenderID,
            ReceiverID  = request.ReceiverID,
            MediaItemID = request.MediaItemID,
            PlaylistID  = request.PlaylistID,
            SharedAt    = DateTime.UtcNow
        };
        var shareID = await _shareRepo.CreateShareMediaAsync(share);
        share.ShareID = shareID;

        var sender = await _userRepo.GetUserByIdAsync(request.SenderID);
        var notification = new Domain.Entities.Notification
        {
            NotificationID = 0,
            Title = $"{sender?.UserName} đã chia sẻ với bạn",
            Type = "share",
            Payload = JsonSerializer.Serialize(new
            {
                shareID = shareID,
                senderName = sender?.UserName,
                mediaItemID = request.MediaItemID,
                playlistID = request.PlaylistID  
            }),
            IsRead = false,
            UserID = request.ReceiverID
        };
        await _notifRepo.CreateNotificationAsync(notification);
        await _pushService.SendNotificationAsync(request.ReceiverID, notification.Title);

        return new ShareMediaResponseDto(
            share.ShareID,
            share.SenderID,
            share.ReceiverID,
            share.MediaItemID,
            share.PlaylistID,
            share.SharedAt
        );
    }
}