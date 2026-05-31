using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Domain;
using TuneVault.Domain.Entities;
using TuneVault.Infrastructure.Dapper;
namespace TuneVault.Infrastructure.Repositories
{
    public class UserRepository : TuneVault.Domain.Interfaces.IUserRepository
    {
        private readonly DataContextDapper _db;

        public UserRepository(DataContextDapper db)
        {
            _db = db;
        }

        // Lấy User theo ID (Bỏ qua những user đã bị xóa mềm)
        public async Task<AspNetUsers> GetUserByIdAsync(string userId)
        {   
            string sql = "SELECT * FROM AspNetUsers WHERE UserID = @UserID AND IsDeleted = 0";
            return await _db.LoadDataSingleAsync<AspNetUsers>(sql, new { UserID = userId });
        }

        // Lấy User theo Email
        public async Task<AspNetUsers> GetUserByEmailAsync(string email)
        {
            string sql = "SELECT * FROM AspNetUsers WHERE Email = @Email AND IsDeleted = 0";
            return await _db.LoadDataSingleAsync<AspNetUsers>(sql, new { Email = email });
        }

        // Tạo User mới
        public async Task<int> CreateUserAsync(AspNetUsers user)
        {
            string sql = @" 
                DECLARE @NextId INT;
                DECLARE @NewUserID NVARCHAR(450);

                SELECT @NextId = ISNULL(MAX(CAST(SUBSTRING(UserId, 2, LEN(UserId)) AS INT)), 0) + 1 FROM AspNetUsers;
                SET @NewUserID = 'U' + CAST(@NextId AS NVARCHAR(450));
            
                INSERT INTO AspNetUsers 
                    (UserID, UserName, Email, Password, Role, Phone, IsDeleted)
                VALUES
                    (@NewUserID, @UserName, @Email, @Password, @Role, @Phone, 0)
            ";
            
            // Dùng ExecuteAsync cho lệnh ghi dữ liệu
            return await _db.ExecuteDataAsync(sql, user);
        }

        // Cập nhật tên
        public async Task<int> UpdateUserNameAsync(AspNetUsers user)
        {
            string sql = @"UPDATE AspNetUsers 
                           SET UserName = @UserName
                           WHERE UserID = @UserID AND IsDeleted = 0";
                           
            return await _db.ExecuteDataAsync(sql, new { UserName = user.UserName, UserID = user.UserID });
        }

        // Cập nhật Avatar
        public async Task<int> UpdateUserImageAsync(AspNetUsers user)
        {
            string sql = @"UPDATE AspNetUsers 
                           SET UserImage = @UserImage
                           WHERE UserID = @UserID AND IsDeleted = 0";
                           
            return await _db.ExecuteDataAsync(sql, new { UserImage = user.UserImage, UserID = user.UserID });
        }

        // Cập nhật Profile chung
        public async Task<int> UpdateUserProfileAsync(AspNetUsers user)
        {
            string sql = @"UPDATE AspNetUsers 
                           SET Email = @Email,
                               Phone = @Phone
                           WHERE UserID = @UserID AND IsDeleted = 0";
                           
            return await _db.ExecuteDataAsync(sql, new { Email = user.Email, Phone = user.Phone, UserID = user.UserID });
        }

        // XÓA MỀM TÀI KHOẢN
        public async Task<int> DeleteUserAsync(string userId)
        {
            string sql = @"UPDATE AspNetUsers 
                           SET IsDeleted = 1
                           WHERE UserID = @UserID";
                           
            return await _db.ExecuteDataAsync(sql, new { UserID = userId });
        }
    }
}