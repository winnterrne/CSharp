using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class Playlist
    {
        public int? PlaylistID{get; set;} //Primary Key
        public string? PlaylistName{get; set;}
        public bool? IsPublic{get; set;}
        public string? Description{get; set;}
        public string? UserID{get; set;} //Foreign Key to AspNetUsers
    }
}