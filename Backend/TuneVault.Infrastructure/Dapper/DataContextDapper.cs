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

    public IDbConnection CreataConnection() => new SqlConnection(_connectionString);
    public T LoadDataString<T> (string sql)
    {
        using var con = CreataConnection();
        return con.QueryFirstOrDefault<T>(sql);
    }
}