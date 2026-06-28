using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class UpdateProfileCommandHandler
    : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IFileStorageService _fileStorage;

    public UpdateProfileCommandHandler(
        IUserRepository userRepository,
        IFileStorageService fileStorage)
    {
        _userRepository = userRepository;
        _fileStorage = fileStorage;
    }

    public async Task<UserProfileDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserByIdAsync(request.UserID);

        if (user == null)
            throw new Exception("User not found");

        if (!string.IsNullOrWhiteSpace(request.UserName))
            user.UserName = request.UserName;

        if (request.Avatar != null)
        {
            var fileName = await _fileStorage.SaveFileAsync(
                request.Avatar.OpenReadStream(),
                request.Avatar.FileName,
                "images/users"
            );
            user.UserImage = Path.GetFileName(fileName);
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
