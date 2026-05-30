using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class MediaShare
    {
        public int? ShareID{get; set;} //Primary Key
        public string? SenderID{get; set;} //Foreign Key to AspNetUsers
        public string? ReceiverID{get; set;} //Foreign Key to AspNetUsers
        public int? MediaItemID{get; set;} //Foreign Key to MediaItem
        public int? PlaylistID{get; set;} //Foreign Key to Playlist (nullable if sharing a single media item)
        public DateTime? SharedAt{get; set;}
    }
}