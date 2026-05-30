using System;
using Microsoft.Data.SqlClient;

class Program
{
    static void Main()
    {
        string connStr = "Server=MSI;Database=TuneVault;User Id=sa;Password=123;TrustServerCertificate=True;";

        using (SqlConnection conn = new SqlConnection(connStr))
        {
            try
            {
                conn.Open();
                Console.WriteLine("Kết nối OK");

                string query = "SELECT TOP 3 TitleName FROM MediaItem";
                SqlCommand cmd = new SqlCommand(query, conn);

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Console.WriteLine(reader["TitleName"].ToString());
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}