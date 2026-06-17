using MediatR;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.UseCases.Artist;
namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ArtistController : Controller
{
    private readonly IMediator _mediator;
    public ArtistController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{artistId}/profile")]
    public async Task<IActionResult> GetArtistProfile(int artistId)
    {
        var result = await _mediator.Send(
            new GetArtistProfileQuery(artistId));

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] SearchArtistQuery query)
    {
        var result = await _mediator.Send(query);

        return Ok(new
        {
            success = true,
            data = result
        });
    }
}
