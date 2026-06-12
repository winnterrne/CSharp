using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<AspNetUsers> GetUserByIdAsync(string userId);
        Task<AspNetUsers> GetUserByEmailAsync(string email);

        Task<bool> EmailExistsAsync(string email);
        Task<int> CreateUserAsync(AspNetUsers user);
        Task<int> UpdateUserNameAsync(AspNetUsers user);
        Task<int> UpdateUserImageAsync(AspNetUsers user);
        Task<int> UpdateUserProfileAsync(AspNetUsers user);
        Task<int> DeleteUserAsync(string userId);
        Task<AspNetUsers?> GetProfileAsync(string userID);
        Task<int> UpdateProfileAsync(AspNetUsers user);
        Task<(IEnumerable<AspNetUsers> Users, int TotalCount)> SearchAsync(string keyword, int skip, int take);
    }
}