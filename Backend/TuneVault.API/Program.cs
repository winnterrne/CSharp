using System;
using Microsoft.Data.SqlClient;
using TuneVault.Infrastructure.Repositories;
using TuneVault.Infrastructure.Dapper;
using TuneVault.Domain.Entities;
using Dapper;
using Microsoft.Extensions.Configuration;
class Program
{
    static async Task Main()
    {
        var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();

// 2. Tự khởi tạo bằng tay (Không cần Dependency Injection)
var dbContext = new DataContextDapper(configuration);
var userRepo = new UserRepository(dbContext);

// 3. GỌI HÀM TEST LUÔN
Console.WriteLine("=== ĐANG TEST HÀM ===");

try
{
    // Giả sử test lấy thông tin tài khoản U1
    var user = await userRepo.GetUserByIdAsync("U1");
    
    if (user != null)
    {
        Console.WriteLine($"Thành công! Lấy được user: {user.UserName} - {user.Email}");
    }
    else
    {
        Console.WriteLine("Hàm chạy thành công nhưng không có dữ liệu (hoặc user đã bị xóa mềm).");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Lỗi rồi: {ex.Message}");
}
        
    }
}