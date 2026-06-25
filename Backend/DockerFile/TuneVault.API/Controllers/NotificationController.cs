using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.UseCases.Notification;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]

public class NotificationController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = new GetNotificationsQuery(userId!);
        var result = await _mediator.Send(query);
        return Ok(new {success = true, data = result});
    }

    // PUT /api/notification/{id}/read — Đánh dấu đã đọc
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var command = new MarkNotificationReadCommand(id);
        var result = await _mediator.Send(command);
        return Ok(new { success = true, data = result });
    }

    // PUT /api/notification/read-all — Đánh dấu tất cả đã đọc
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var command = new MarkAllNotificationsReadCommand(userId!);
        var result = await _mediator.Send(command);
        return Ok(new { success = true, data = result });
    }
}
