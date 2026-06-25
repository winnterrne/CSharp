using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.UseCases.AI;
using System.Security.Claims;

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
        var result = await _mediator.Send(
            new GenerateMediaDescriptionCommand(mediaId));

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    [Authorize]
    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _mediator.Send(
                new GetRecommendationsQuery(userId));

            return Ok(new
            {
                success = true,
                data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message,
                detail = ex.InnerException?.Message
            });
        }
    }
}