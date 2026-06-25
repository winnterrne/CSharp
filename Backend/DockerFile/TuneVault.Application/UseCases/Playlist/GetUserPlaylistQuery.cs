using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Playlist;
public record GetUserPlaylistQuery (
    string UserID
):  IRequest<IEnumerable<MyPlaylistDto>>;