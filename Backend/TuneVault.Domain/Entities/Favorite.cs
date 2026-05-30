using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class Favorite
    {
        public string? UserID{get; set;} //Foreign Key to AspNetUsers
        public int? MediaItemID{get; set;} //Foreign Key to MediaItem
    }
}