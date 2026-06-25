using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace TuneVault.Infrastructure.Dapper
{
    public class DataContextDapper
    {
        private readonly string _connectionString;
        public DataContextDapper (IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")?? throw new Exception("Connection string 'DefaultConnection' not found.");
        }

        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
        
        // Đọc Data (SELECT)
        public async Task<T> LoadDataSingleAsync<T>(string sql, object? parameters = null)
        {
            using var conn = CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<T>(sql, parameters);
        }
        public async Task<IEnumerable<T>> LoadAllDataSingleAsync<T>(string sql,object? parameters = null)
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<T>(sql, parameters);
        }
        // Thêm, cập nhật, xóa (INSERT, UPDATE, DELETE)
        // Trả về số dòng bị ảnh hưởng
        public async Task<int> ExecuteDataAsync(string sql, object? parameters = null)
        {
            using var conn = CreateConnection();
            return await conn.ExecuteAsync(sql, parameters);
        }
        // Thực thi câu lệnh trả về một giá trị duy nhất (INSERT với OUTPUT, hoặc SELECT COUNT(*), v.v.)
        public async Task<T?> ExecuteScalarAsync<T>(string sql, object? parameters = null)
        {
            using var conn = CreateConnection();
            return await conn.ExecuteScalarAsync<T?>(sql, parameters);
        }

    }
    
}