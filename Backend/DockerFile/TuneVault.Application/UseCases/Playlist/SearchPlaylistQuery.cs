using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Playlist;

public record SearchPlaylistQuery(
    string KeyWord = " ",
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<SearchPlaylistResultDto>;