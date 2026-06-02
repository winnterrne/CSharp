using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Infrastructure.Dapper;

namespace TuneVault.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly DataContextDapper _db;

    public NotificationRepository(DataContextDapper db)
    {
        _db = db;
    }

    public async Task<int> CreateNotificationAsync(Notification notification) {
        string sql = @"INSERT INTO TuneVault.Notification
                            (NotificationID, Title, Type, Payload, IsRead, UserID, IsDeleted)
                        OUTPUT INSERTED.NotificationID
                        VALUES
                            (@NotificationID, @Title, @Type, @Payload, @IsRead, @UserID, @IsDeleted)";
        return await _db.ExecuteScalarAsync<int>(sql, notification);
    }
    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId) {
        string sql = "SELECT * FROM TuneVault.Notification n WHERE UserID = @UserID";
        return await _db.LoadAllDataSingleAsync<Notification> (sql, new {UserID = userId});
    }
        
        // Đánh dấu thông báo đã đọc (Cập nhật cột IsRead = 1)
    public async Task<int> MarkAsReadAsync(int notificationId) {
        string sql = "UPDATE TuneVault.Notification SET IsRead = 1 WHERE NotificationID = @NotificationID";
        return await _db.ExecuteDataAsync(sql, new { NotificationID = notificationId });
    }

}