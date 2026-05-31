using System.ComponentModel.Design;
using TuneVault.Application;
namespace TuneVault.Infrastructure;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{

    public readonly DataContextDapper _context;
    public readonly string _tableName;

    public GenericRepository(DataContextDapper context, string tableName)
    {
        _context = context;
        _tableName =  tableName;
    }
    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        string sql = $"SELECT * FROM {_tableName}";
        return await _context.QueryAsync<T>(sql);
    }

    public virtual Task<T> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public virtual Task<int> DeleteAsync(int id)
    {
        throw new NotFiniteNumberException();
    }
    
}

