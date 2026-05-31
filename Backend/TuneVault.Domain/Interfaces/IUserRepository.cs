using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces
{
    public interface IUserRepository
    {
        public  Task<AspNetUsers> GetUserByIdAsync(string userId);
        public  Task<AspNetUsers> GetUserByEmailAsync(string email);
        public  Task<int> CreateUserAsync(AspNetUsers user);
         public  Task<int> UpdateUserNameAsync(AspNetUsers user);
        public  Task<int> UpdateUserImageAsync(AspNetUsers user);
        public  Task<int> UpdateUserProfileAsync(AspNetUsers user);
        public  Task<int> DeleteUserAsync(string userId);
    }
}