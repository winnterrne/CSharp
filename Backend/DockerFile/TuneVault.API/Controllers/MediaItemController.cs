using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.MediaItem;
using TuneVault.Application.UseCases.MediaItem.MediaUploading;

namespace TuneVault.API.Controllers
{
    [ApiController]
    [Route("api/media")]
    public class MediaItemController : ControllerBase
    {
        // cái này viết chung với upload với streaming
        private readonly IMediator _mediator;

        public MediaItemController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] UploadMediaFormDto form)
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userID == null)
            {
                return Unauthorized();
            }

            var command = new UploadMediaCommand(
                form.TitleName,
                form.Description,
                form.MediaItemTag,
                form.MediaItemType,
                form.Duration,
                form.ArtistID,
                form.AlbumID,
                userID,
                form.File
            );

            var result = await _mediator.Send(command);
            return Ok(new { success = true, data = result});
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            var query = new GetMediaByIdQuery(id);
            var result = await _mediator.Send(query);
            if(result == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy"});
            }
            return Ok(new { success = true, data = result});
        }

        [Authorize]
        [HttpGet("my-media")]
        public async Task<IActionResult> GetMyMedia()
        {
            var userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var query = new GetMediaByUserQuery(userID!);
            var result = await _mediator.Send(query);
            return Ok(new { success = true, data = result});
        }
    }
}