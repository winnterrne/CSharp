using TuneVault.Domain.Entities;

namespace TuneVault.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(AspNetUsers user);
}