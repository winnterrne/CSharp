using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TuneVault.Domain.Entities
{
    public class Notification
    {
        public int? NotificationID{get; set;} //Primary Key
        public string? Title{get; set;}
        public string? Type{get; set;}
        public string? Payload{get; set;}
        public bool? IsRead{get; set;}
        public string? UserID{get; set;} //Foreign Key to AspNetUsers
    }
}