using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
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
    
[Authorize]
[HttpPost("favorite/{mediaItemId}")]
public async Task<IActionResult> AddLike(int mediaItemId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new AddFavoriteCommand(
            userId,
            mediaItemId
        ));
        if(result > 0) {
            return Ok(new { success = true, message = "Added to favorites"});
        } else {
            return BadRequest(new { success = false, message = "Failed to add to favorites"});
        }
    }

[Authorize]
[HttpDelete("favorite/{mediaItemId}")]
public async Task<IActionResult> RemoveLike(int mediaItemId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new RemoveFavoriteCommand(
            userId,
            mediaItemId
        ));
        if(result > 0) {
            return Ok(new { success = true, message = "Removed from favorites"});
        } else {
            return BadRequest(new { success = false, message = "Failed to remove from favorites"});
        }
    }
[Authorize]
[HttpGet("favorites")]
public async Task<IActionResult> GetUserFavorites()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new GetUserFavoriteQuery(userId));
        return Ok(result);
    }

[Authorize]
[HttpPost("playhistory")]
public async Task<IActionResult> RecordPlayHistory(CreatePlayHistoryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new RecordPlayHistoryCommand(
            userId,
            dto.MediaItemID
        ));
        if(result > 0) {
            return Ok(new { success = true, message = "Play history recorded"});
        } else {
            return BadRequest(new { success = false, message = "Failed to record play history"});
        }
    }
[Authorize]
[HttpGet("playhistory")]
public async Task<IActionResult> GetRecentPlayHistory([FromQuery] int limit = 10)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var query = new GetRecentPlayHistoryQuery(
            userId,
            limit
        );
        var result = await _mediator.Send(query);
        return Ok(result);
    }
[Authorize]
[HttpPost("follow/user/{followingUserId}")]
public async Task<IActionResult> FollowUser(string followingUserId)
    {
        var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userID == null) return Unauthorized();
        if(userID == followingUserId) return BadRequest("Không thể theo dõi chính mình");
        var followID = await _mediator.Send(new FollowCommand(userID, followingUserId));
        if(followID == 0) return Conflict("Đã theo dõi người dùng này");
        return Ok(new { success = true, message = "Đã theo dõi người dùng", followID });
    }
[Authorize]
[HttpPost("follow/artist/{artistId}")]
public async Task<IActionResult> FollowArtist(int artistId)
    {
        var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userID == null) return Unauthorized();
        var followID = await _mediator.Send(new FollowArtistCommand(userID, artistId));
        if(followID == 0) return Conflict("Đã theo dõi nghệ sĩ này");
        return Ok(new { success = true, message = "Đã theo dõi nghệ sĩ", followID });
    }
}