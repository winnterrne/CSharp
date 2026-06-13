using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Auth;
namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO dto)
    {
        var command = new RegisterCommand(
            dto.UserName, dto.Email, dto.Password, dto.Phone
        );
        var result = await _mediator.Send(command);
        return Ok(new {success = true, data = result});
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
    {
        var command = new LoginCommand(dto.Email, dto.Password);
        var result = await _mediator.Send(command);
        return Ok(new { success = true, data = result });
    }
}