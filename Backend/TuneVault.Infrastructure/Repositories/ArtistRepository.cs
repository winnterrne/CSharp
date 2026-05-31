using TuneVault.Domain.Entities;
using TuneVault.Application;
using Dapper;
namespace TuneVault.Infrastructure;

public class ArtistRepository : GenericRepository<Artist>, IArtistRepository
{
    public ArtistRepository(DataContextDapper context) : base(context, "Artist") {}
    public async Task<Artist> GetByNameAsync(string name)
    {
        using var con = _context.CreateConnection();
            return await con.QueryFirstOrDefaultAsync<Artist>(
            "SELECT * FROM Artists WHERE Name LIKE @Name",
            new { Name = $"%{name}%" });
    }
}