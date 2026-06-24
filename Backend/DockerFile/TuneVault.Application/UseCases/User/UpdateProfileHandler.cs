using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class UpdateProfileCommandHandler
    : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private readonly IUserRepository _userRepository;

    public UpdateProfileCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserProfileDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserByIdAsync(request.UserID);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (!string.IsNullOrWhiteSpace(request.UserName))
            user.UserName = request.UserName;

        if (request.Avatar != null)
        {
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "media",
                "images",
                "users"
            );

            Directory.CreateDirectory(uploadsFolder);

            var fileName =
                $"{Guid.NewGuid()}{Path.GetExtension(request.Avatar.FileName)}";

            var filePath =
                Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(
                filePath,
                FileMode.Create
            );

            await request.Avatar.CopyToAsync(stream);

            user.UserImage = fileName;
        }

        if (!string.IsNullOrWhiteSpace(request.Phone))
            user.Phone = request.Phone;

        if (!string.IsNullOrWhiteSpace(request.Bio))
            user.Bio = request.Bio;

        await _userRepository.UpdateProfileAsync(user);

        return new UserProfileDto(
            user.UserID,
            user.UserName,
            user.UserImage,
            user.Email,
            user.Role,
            user.Phone,
            user.Bio
        );
    }
}