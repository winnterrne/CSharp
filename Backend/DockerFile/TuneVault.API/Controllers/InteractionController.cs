using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using TuneVault.Application.UseCases.Interaction;
using TuneVault.Domain.Interfaces;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InteractionController : Controller
{
    private readonly IMediator _mediator;
    public InteractionController(IMediator mediator)
    {
        _mediator = mediator;
    }
    

[HttpPost("favorite/{mediaItemId}")]
public async Task<IActionResult> AddLike(int mediaItemId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new AddFavoriteCommand(
            userId,
            mediaItemId
        ));
        return Ok(result);
    }


[HttpDelete("favorite/{mediaItemId}")]
public async Task<IActionResult> RemoveLike(int mediaItemdId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new RemoveFavoriteCommand(
            userId,
            mediaItemdId
        ));
        return Ok(result);
    }
}