using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Playlist;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlaylistController : Controller
{
    private readonly IMediator _mediator;
    public PlaylistController(IMediator mediator)
    {
        _mediator = mediator;
    }
[HttpGet("{id}")]
public async Task<IActionResult> GetPlaylistById(int id)
    {
        var query = new GetPlaylistByIdQuery(id);
        var result = await _mediator.Send(query);
        if(result == null)
        {
            return NotFound(new {succes = false, message = "Playlist not found"});
        }
        return Ok(new {succes = true, data = result});
    }
// Layplaylist cua ng dung
[Authorize]
[HttpGet("my-playlist")]
public async Task<IActionResult> GetUserPlaylist()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var result = await _mediator.Send(new GetUserPlaylistQuery(userId));
        return Ok(new {succes = true, data = result});
    }
// Tao 1 playlist
[Authorize]
[HttpPost]
public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();
        var command = new CreatePlaylistCommand(
            dto.PlaylistName,
            dto.IsPublic,
            dto.Description,
            userId
        );
        var result = await _mediator.Send(command);
        return Ok(new {success = true, message = "Playlist created successfully", result});
    }
// xoa 1 playlist
[HttpDelete("{id}")]
public async Task<IActionResult> DeletePlaylist(int id)
    {
        var result = await _mediator.Send(new DeletePlaylistCommand(id));
        if(result <= 0) return NotFound(new {success = false, message = "Playlist not found"});
        return Ok(new {success = true, message = "Playlist deleted successfully"});
    }

// Add Track To List
[HttpPost("{playlistId}/tracks/{mediaItemId}")]
public async Task<IActionResult> AddTrackToLisst(int playlistId, int mediaItemId)
    {
        var result = await _mediator.Send(new AddTrackToPlaylistCommand(playlistId, mediaItemId));
        if(result <= 0) return NotFound(new {success = false, message = "Playlist or Media Item not found"});
        return Ok(new {success = true, message = "Track added to playlist successfully"});
    }
    
// Remove Track From List
[HttpDelete("{playlistId}/tracks/{mediaItemId}")]
public async Task<IActionResult> RemoveTrack(
    int playlistId,
    int mediaItemId)
{
    var result = await _mediator.Send(
        new RemoveTrackFromPlaylistCommand(
            playlistId,
            mediaItemId
        ));

    if(result <= 0) return NotFound(new {success = false, message = "Playlist or Media Item not found"});
    return Ok(new {success = true, message = "Track removed from playlist successfully"});
}

}
