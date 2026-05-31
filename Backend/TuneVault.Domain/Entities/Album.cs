using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class Album
    {
         public required string AlbumID{get; set;} //Primary Key
        public string? AlbumName{get; set;}
        public string? Title{get; set;}
        public string? AlbumItemImage{get; set;}
        public DateTime? ReleaseDate{get; set;}
        public DateTime? UploadAt{get; set;}
        public required int ArtistID{get; set;} //Foreign Key to Artist
        public required string UserID{get; set;} //Foreign Key to AspNetUsers
        public bool? IsDeleted{get; set;}
    }
}