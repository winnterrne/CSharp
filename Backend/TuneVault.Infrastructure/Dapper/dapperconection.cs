using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Dapper;

string connectionString =
"Server=.;Database=SchoolDB;Trusted_Connection=True;";

using SqlConnection conn = new SqlConnection(connectionString);

conn.Open();

if (conn.State == System.Data.ConnectionState.Open)
{
    Console.WriteLine("Đã kết nối");
}
namespace TuneVault.Infrastructure.Dapper
{
    public class dapperconection
    {
        static void Main(string[] args)
        {
            System.Console.WriteLine();
        }
    }
}