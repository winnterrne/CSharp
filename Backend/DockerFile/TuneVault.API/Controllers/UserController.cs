using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.User;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/controller")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(string id)
    {
        var query = new GetProfileQuery(id);
        var result = await _mediator.Send(query);
        return Ok( new {success = true, data = result});
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(
        string id,
        [FromBody] UpdateProfileDTO dto)
    {
        var command = new UpdateProfileCommand(
            id, 
            dto.UserName,
            dto.UserImage,
            dto.Phone
        );

        var result = await _mediator.Send(command);
        return Ok(new { success = true, data = result});
    }
}