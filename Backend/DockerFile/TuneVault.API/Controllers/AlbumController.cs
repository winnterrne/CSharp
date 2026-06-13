using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;
using TuneVault.Application.UseCases.Albums;

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

    // [Authorize]
    [HttpGet("{id}/tracks")]
    public async Task<IActionResult> GetAlbumTracks(int id)
    {
        var result = await _mediator.Send(new GetAlbumTracksQuery(id));

        return Ok(new
        {
            success = true,
            data = result
        });
    }
    [Authorize] // Bắt buộc phải đăng nhập mới được tạo Album
    [HttpPost]
    public async Task<IActionResult> CreateAlbum([FromBody] CreateAlbumCommand command)
    {
        // Gửi Command sang Handler xử lý
        var newAlbumId = await _mediator.Send(command);

        if (newAlbumId > 0)
        {
            return Ok(new
            {
                success = true,
                message = "Tạo Album thành công!",
                data = newAlbumId
            });
        }

        return BadRequest(new
        {
            success = false,
            message = "Tạo Album thất bại, vui lòng kiểm tra lại!"
        });
    }
}