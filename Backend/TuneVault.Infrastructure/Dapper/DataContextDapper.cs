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
            return await conn.QueryFirstOrDefaultAsync<T>(sql, parameters)?? throw new Exception("Connection string 'DefaultConnection' not found.") ;
        }
        public async Task<IEnumerable<T>> LoadAllDataSingleAsync<T>(string sql,object? parameters = null)
        {
            using var conn = CreateConnection();
            return await conn.QueryAsync<T>(sql, parameters);
        }
        // Thêm, cập nhật, xóa (INSERT, UPDATE, DELETE)
        public async Task<int> ExecuteDataAsync(string sql, object? parameters = null)
        {
            using var conn = CreateConnection();
            return await conn.ExecuteAsync(sql, parameters);
        }

    }
    
}