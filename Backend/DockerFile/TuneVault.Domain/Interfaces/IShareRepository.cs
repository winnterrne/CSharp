using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
namespace TuneVault.Domain.Interfaces
{
    public interface IShareRepository
    {
         Task<int> CreateShareMediaAsync(MediaShare share);
        Task<IEnumerable<MediaShare>> GetSharedWithMeAsync(string receiverId);
        Task<IEnumerable<MediaShare>> GetSharedByMeAsync(string senderId);
        Task<bool> AlreadySharedAsync(
        string senderID, string receiverID, 
        int? mediaItemID, int? playlistID);
        
    }
}