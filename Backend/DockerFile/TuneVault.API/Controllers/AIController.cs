using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.UseCases.AI;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IMediator _mediator;

    public AIController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("description/{mediaId}")]
    public async Task<IActionResult> GenerateDescription(int mediaId)
    {
        var result =await _mediator.Send(new GenerateMediaDescriptionCommand(mediaId));
        return Ok(result);
    }
}