using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class Follow
    {
        public required int FollowID{get; set;} //Primary Key
        public required string FollowerID{get; set;} //Foreign Key to AspNetUsers
        public string? FollowingUserID{get; set;} //Foreign Key to AspNetUsers
        public int? FollowingArtistID{get; set;} //Foreign Key to Artist
    }
}