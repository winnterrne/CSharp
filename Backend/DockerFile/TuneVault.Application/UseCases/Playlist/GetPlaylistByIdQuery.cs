using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Playlist;

public record GetPlaylistByIdQuery (
    int PlaylistID
) : IRequest<PlaylistDto?>;