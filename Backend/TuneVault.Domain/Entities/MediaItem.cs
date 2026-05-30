using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class MediaItem
    {
        public int MediaItemID{get; set;} //Primary Key
        public string? TitleName{get; set;}
        public string? MediaItemImage{get; set;}
        public string? filePath{get; set;}
        public string? MediaType{get; set;}
        public string? MediaTag{get; set;}
        public int? Duration{get; set;}
        public DateTime? UploadAt{get; set;}
        public string? Description{get; set;}
        public string UserID{get; set;} //Foreign Key to AspNetUsers
        public int AlbumID{get; set;} //Foreign Key to Album
        public int ArtistID{get; set;} //Foreign Key to Artist
        public bool? IsDelete{get; set;}
    }
}