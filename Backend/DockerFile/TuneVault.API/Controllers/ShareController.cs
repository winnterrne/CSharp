using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Share;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShareController : ControllerBase
{
    private readonly IMediator _mediator;

    public ShareController (IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Share([FromBody] ShareMediaRequestDto dto)
    {
        var senderID = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(senderID == null) return Unauthorized();
        var command = new ShareMediaCommand(
            senderID,
            dto.ReceiverID,
            dto.MediaItemID,
            dto.PlaylistID
        );

        var result = await _mediator.Send(command);
        return Ok(new {success = true, data = result});
    }

    [HttpGet("received")]
    public async Task<IActionResult> GetReceived()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = new GetReceivedSharesQuery(userId!);
        var result = await _mediator.Send(query);
        return Ok(new {success = true, data = result});
    }

    [HttpGet("sent")]
    public async Task<IActionResult> GetSent()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = new GetSentSharesQuery(userId!);
        var result = await _mediator.Send(query);
        return Ok(new {success = true, data = result});
    }

    
}
