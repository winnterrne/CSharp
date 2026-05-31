using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class Artist
    {
    public required string ArtistID{get; set;} //Primary Key
    public string? ArtistName{get; set;}
    public string? ArtistImage{get; set;}
    public DateTime? CreateAt{get; set;}
    public bool? IsDeleted{get; set;}
    }
}