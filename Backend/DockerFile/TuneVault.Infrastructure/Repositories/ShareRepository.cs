using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;
using TuneVault.Infrastructure.Dapper;

namespace TuneVault.Infrastructure.Repositories;
public class ShareRepository : IShareRepository
{
    private readonly DataContextDapper _db;
    public ShareRepository(DataContextDapper db)
    {
        _db = db;
    }
    // Share cho ng khac
    public async Task<int> ShareMediaAsync(MediaShare share)
    {
        string sql = @"INSERT INTO MediaShare(SenderID, ReceiverID, MediaItemID, PlaylistID, SharedAt)
                        OUTPUT INSERTED.ShareID
                        VALUES (@SenderID, @ReceiverID, @MediaItemID, @PlaylistID, @SharedAt)";
        return await _db.ExecuteScalarAsync<int> (sql,share);
    }
    // 
    public async Task<IEnumerable<MediaShare>> GetSharedWithMeAsync(string receiverId)
    {
        string sql  = @"SELECT ms.*, mi.TitleName, mi.MediaItemImage, mi.filePath
                        FROM MediaShare ms 
                        INNER JOIN MediaItem mi on mi.MediaItemID = ms.MediaItemID
                        WHERE ms.ReceiverID = @ReceiverID
                        ORDER BY ms.SharedAt desc";
        return await _db.LoadAllDataSingleAsync<MediaShare>(sql, new {ReceiverID = receiverId});
    }

    public async Task<IEnumerable<MediaShare>> GetSharedByMeAsync(string senderId)
    {
        string sql = @"SELECT  
                        FROM MediaShare ms 
                        INNER JOIN MediaItem mi on mi.MediaItemID = ms.MediaItemID
                        WHERE ms.SenderID = @SenderID
                        ORDER BY ms.SharedAt desc";
        return await _db.LoadAllDataSingleAsync<MediaShare>(sql, new {SenderID = senderId});
    }
}