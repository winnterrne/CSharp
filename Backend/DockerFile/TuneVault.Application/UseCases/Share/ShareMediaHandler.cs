using System.Text.Json;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Share;

public class ShareMediaHandler
    : IRequestHandler<ShareMediaCommand, ShareMediaResponseDto>
{
    private readonly IShareRepository _shareRepo;
    private readonly INotificationRepository _notifRepo;
    private readonly IUserRepository _userRepo;
    private readonly INotificationPushService _pushService;
    private readonly IMediaItemRepository _mediaRepo;
    private readonly IPlaylistRepository _playlistRepo;

    public ShareMediaHandler(
        IShareRepository shareRepo,
        INotificationRepository notifRepo,
        IUserRepository userRepo,
        INotificationPushService pushService,
        IMediaItemRepository mediaRepo,
        IPlaylistRepository playlistRepo)
    {
        _shareRepo = shareRepo;
        _notifRepo = notifRepo;
        _userRepo = userRepo;
        _pushService = pushService;
        _mediaRepo = mediaRepo;
        _playlistRepo = playlistRepo;
    }

    public async Task<ShareMediaResponseDto> Handle(
        ShareMediaCommand request,
        CancellationToken cancellationToken)
    {
        var receiver =
            await _userRepo.GetUserByIdAsync(request.ReceiverID);

        if (receiver == null)
            throw new Exception("Người nhận không tồn tại");

        if (request.MediaItemID == null && request.PlaylistID == null)
            throw new Exception("Phải chọn bài hát/video hoặc playlist để chia sẻ");

        if (request.MediaItemID != null && request.PlaylistID != null)
            throw new Exception("Chỉ được chia sẻ một loại nội dung");

        var alreadyShared =
            await _shareRepo.AlreadySharedAsync(
                request.SenderID,
                request.ReceiverID,
                request.MediaItemID,
                request.PlaylistID);

        if (alreadyShared)
            throw new Exception("Bạn đã chia sẻ nội dung này rồi");

        var share = new MediaShare
        {
            ShareID = 0,
            SenderID = request.SenderID,
            ReceiverID = request.ReceiverID,
            MediaItemID = request.MediaItemID,
            PlaylistID = request.PlaylistID,
            SharedAt = DateTime.UtcNow
        };

        var shareID =
            await _shareRepo.CreateShareMediaAsync(share);

        share.ShareID = shareID;

        var sender =
            await _userRepo.GetUserByIdAsync(request.SenderID);

        TuneVault.Domain.Entities.MediaItem? media = null;

        TuneVault.Domain.Entities.Playlist? playlist = null;
        int playlistTrackCount = 0;

        if (request.MediaItemID.HasValue)
        {
            media =
                await _mediaRepo.GetMediaByIdAsync(
                    request.MediaItemID.Value);
        }

        if (request.PlaylistID.HasValue)
        {
            var playlistResult =
                await _playlistRepo.GetPlaylistByIdAsync(
                    request.PlaylistID.Value);

            playlist = playlistResult.Playlist;
            playlistTrackCount = playlistResult.Songs.Count();
        }

        var isSong = request.MediaItemID.HasValue;

        // ✅ NOTIFICATION FLOW: phân loại rõ share_song / share_playlist
        var notification =
    new TuneVault.Domain.Entities.Notification
    {
        NotificationID = 0,
        Title = isSong
                ? $"{sender?.UserName ?? "Ai đó"} đã chia sẻ bài hát"
                : $"{sender?.UserName ?? "Ai đó"} đã chia sẻ playlist",
        Type = isSong ? "share_song" : "share_playlist",
        Payload = JsonSerializer.Serialize(new
        {
            shareID,
            senderID = request.SenderID,
            senderName = sender?.UserName,
            senderAvatar = sender?.UserImage,

            targetType = isSong ? "song" : "playlist",

            mediaItemID = request.MediaItemID,
            mediaTitle = media?.TitleName,
            artistName = media?.ArtistName,
            imageUrl = media?.MediaItemImage,

            playlistID = request.PlaylistID,
            playlistName = playlist?.PlaylistName,
            playlistDescription = playlist?.Description,
            trackCount = playlistTrackCount
        }),
        IsRead = false,
        UserID = request.ReceiverID,
        NoticedAT = DateTime.UtcNow,
        IsDeleted = false
    };

        var notificationID =
            await _notifRepo.CreateNotificationAsync(notification);

        notification.NotificationID = notificationID;

        // ✅ NOTIFICATION FLOW: push realtime về FE
        await _pushService.SendNotificationAsync(
            request.ReceiverID,
            notification
        );

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