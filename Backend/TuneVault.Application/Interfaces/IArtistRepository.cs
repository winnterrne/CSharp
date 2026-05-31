using TuneVault.Domain.Entities;

namespace TuneVault.Application;
public interface IArtistRepository : IGenericRepository<Artist>
{
    
    Task<Artist> GetByNameAsync(string name);
}