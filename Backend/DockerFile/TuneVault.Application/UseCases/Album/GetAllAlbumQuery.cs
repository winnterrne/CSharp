using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;

namespace TuneVault.Application.UseCases;

public record GetAllAlbumQuery(): IRequest<IEnumerable<AlbumDto>>;