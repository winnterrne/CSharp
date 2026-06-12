using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.MediaItem.MediaUploading;
using TuneVault.Application.UseCases.MediaItem.MediaStreaming;
using TuneVault.Application.UseCases.Interaction;


namespace TuneVault.API.Controllers
{
    [ApiController]
    [Route("api/media")]
    public class MediaItemController : ControllerBase
    {
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

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var query = new GetAllMediaQuery();
            var result = await _mediator.Send(query);
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
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMediaRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var command = new UpdateMediaCommand(
                id,
                userId,
                dto.TitleName,
                dto.Description,
                dto.MediaItemTag,
                dto.MediaItemImage,
                dto.ArtistID,
                dto.AlbumID
            );
            var result = await _mediator.Send(command);
             return Ok(new { success = true, data = result });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var command = new DeleteMediaCommand(id, userId);   
            var result = await _mediator.Send(command);
            return Ok(new { success = true, data = result });
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

        [Authorize]
        [HttpGet("{id}/stream")]
        public async Task<IActionResult> Streaming(int id)
        {
            var mediaItem = await _mediator.Send(new GetMediaInfoQuery(id));
            if (mediaItem == null || string.IsNullOrEmpty(mediaItem.filePath))
            {
                return NotFound(new { success = false, message = "File media không tồn tại" });
            }
            var fileName = mediaItem.filePath.Trim().TrimStart('/','\\');
            var type = mediaItem.MediaItemType?.ToLower();
            bool isVideo = type == "video";
            string subFolder = isVideo ? "video" : "audio";
            string contentType = mediaItem.MediaItemType?.ToLower() == "video" ? "video/mp4" : "audio/mpeg";

            var physicalPath = System.IO.Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "media",
                subFolder,
                fileName
            );

            if (!System.IO.File.Exists(physicalPath))
            {
                return NotFound(new { success = false, message = $"File media không tồn tại trên hệ thống hệ server tại vị trí: uploads/{subFolder}/{fileName}" });
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await _mediator.Send(new RecordPlayHistoryCommand(userId, id));
            }

            return PhysicalFile(physicalPath, contentType, enableRangeProcessing: true);
            
        }
    }
}
