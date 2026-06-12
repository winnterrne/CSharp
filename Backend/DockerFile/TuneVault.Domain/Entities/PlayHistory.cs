using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class PlayHistory
    {
        public int HistoryID { get; set; } // Primary Key (DB-generated)
        public string UserID { get; set; } // Foreign Key to AspNetUsers
        public int MediaItemID { get; set; } // Foreign Key to MediaItem
        public DateTime? PlayedAt { get; set; }

        public PlayHistory(string userID, int mediaItemID, DateTime? playedAt = null)
        {
            UserID = userID ?? throw new ArgumentNullException(nameof(userID));
            MediaItemID = mediaItemID;
            PlayedAt = playedAt ?? DateTime.UtcNow;
        }
        public PlayHistory() { } // Parameterless constructor
        public MediaItem MediaItem { get; set; }
    }
}