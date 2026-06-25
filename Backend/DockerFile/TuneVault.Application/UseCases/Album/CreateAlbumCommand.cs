using MediatR;
using System;

namespace TuneVault.Application.UseCases.Albums;


public record CreateAlbumCommand(
    string AlbumName,
    string Title,
    string AlbumItemImage,
    DateTime? ReleaseDate,
    int ArtistID,
    string UserID
) : IRequest<int>;