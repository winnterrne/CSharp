using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class PlaylistTrack
    {
        public int PLaylist{get; set;} //Foreign Key to Playlist
        public int MediaItemID{get; set;} //Foreign Key to MediaItem
    }
}