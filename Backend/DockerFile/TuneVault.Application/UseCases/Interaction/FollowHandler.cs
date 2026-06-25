using System.Text.Json;
using MediatR;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Interaction;

public class FollowHandler : IRequestHandler<FollowCommand, int>
{
    private readonly IInteractionRepository _repo;
    private readonly IUserRepository _userRepo;
    private readonly INotificationRepository _notifRepo;
    private readonly INotificationPushService _pushService;

    public FollowHandler(
        IInteractionRepository repo,
        IUserRepository userRepo,
        INotificationRepository notifRepo,
        INotificationPushService pushService)
    {
        _repo = repo;
        _userRepo = userRepo;
        _notifRepo = notifRepo;
        _pushService = pushService;
    }

    public async Task<int> Handle(
        FollowCommand request,
        CancellationToken cancellationToken)
    {
        var follow = new Domain.Entities.Follow
        {
            FollowID = 0,
            FollowerID = request.FollowerID,
            FollowingUserID = request.FollowingUserID,
            FollowingArtistID = null
        };

        var followId = await _repo.FollowAsync(follow);

        var follower =
            await _userRepo.GetUserByIdAsync(request.FollowerID);

        // ✅ NOTIFICATION FLOW: tạo notification follow user
        var notification =
    new TuneVault.Domain.Entities.Notification
{
            NotificationID = 0,
            Title = $"{follower?.UserName ?? "Ai đó"} đã theo dõi bạn",
            Type = "follow",
            Payload = JsonSerializer.Serialize(new
            {
                targetType = "follow",
                followerID = request.FollowerID,
                followerName = follower?.UserName,
                followerAvatar = follower?.UserImage
            }),
            IsRead = false,
            UserID = request.FollowingUserID,
            NoticedAT = DateTime.UtcNow,
            IsDeleted = false
        };

        var notificationID =
            await _notifRepo.CreateNotificationAsync(notification);

        notification.NotificationID = notificationID;

        await _pushService.SendNotificationAsync(
            request.FollowingUserID,
            notification
        );

        return followId;
    }
}