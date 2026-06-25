using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Artist;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases;

public class SearchArtistQueryHandler
    : IRequestHandler<SearchArtistQuery, SearchArtistResultDto>
{
    private readonly IArtistRepository _artistRepo;

    public SearchArtistQueryHandler(IArtistRepository artistRepo)
    {
        _artistRepo = artistRepo;
    }

    public async Task<SearchArtistResultDto> Handle(
        SearchArtistQuery request,
        CancellationToken cancellationToken)
    {
        int skip = (request.PageNumber - 1) * request.PageSize;

        var artists = await _artistRepo.SearchAsync(
            request.KeyWord,
            skip,
            request.PageSize);

        var artistDtos = artists.Artists.Select(a =>
            new ArtistProfileDto(
                a.ArtistID,
                a.ArtistName,
                a.ArtistImage,
                a.Bio
            ));

        int totalPages = artists.TotalCount > 0
            ? (int)Math.Ceiling((double)artists.TotalCount / request.PageSize)
            : 0;

        return new SearchArtistResultDto(
            artistDtos,
            totalPages
        );
    }
}