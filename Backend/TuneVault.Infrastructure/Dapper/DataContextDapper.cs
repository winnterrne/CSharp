using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;

namespace TuneVault.Infrastructure;

public class DataContextDapper
{
    private readonly string _connectionString;
    public DataContextDapper (string connectionString)
    {
        _connectionString = connectionString;
    }

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    
    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object ? param = null)
    {
        using var con = CreateConnection();
        return await con.QueryAsync<T>(sql, param);
    }
}