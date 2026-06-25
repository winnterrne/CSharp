using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Artist;

public record SearchArtistQuery(
    string KeyWord = "",
    int PageNumber = 1,
    int PageSize = 10  
) : IRequest<SearchArtistResultDto>;