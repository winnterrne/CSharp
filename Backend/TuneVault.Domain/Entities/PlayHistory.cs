using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class PlayHistory
    {
        public int? HistoryID{get; set;} //Primary Key
        public string? UserID{get; set;} //Foreign Key to AspNetUsers
        public int? MediaItemID{get; set;} //Foreign Key to MediaItem
        public DateTime? PlayedAt{get; set;}
    }
}