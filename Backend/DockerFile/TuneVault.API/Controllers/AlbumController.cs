using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlbumController : ControllerBase
{
    private readonly IMediator _mediator;

    public AlbumController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // [Authorize]
    [HttpGet("albums")]
    public async Task<IActionResult> GetAllAlbum()
    {
         var result = await _mediator.Send(new GetAllAlbumQuery());

            return Ok(new
            {
                success = true,
                data = result
            });
    }
}