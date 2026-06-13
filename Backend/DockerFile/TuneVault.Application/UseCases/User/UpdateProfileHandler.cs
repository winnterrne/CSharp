using MediatR;
using TuneVault.Application.Dtos;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class UpdateProfileHandler 
    : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private readonly IUserRepository _userRepo;

    public UpdateProfileHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<UserProfileDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Kiểm tra user tồn tại không
        var user = await _userRepo.GetProfileAsync(request.UserID);
        if (user == null)
            throw new Exception("Người dùng không tồn tại");

        // 2. Cập nhật thông tin — chỉ sửa những gì client gửi lên
        user.UserName  = request.UserName  ?? user.UserName;
        user.UserImage = request.UserImage ?? user.UserImage;
        user.Phone     = request.Phone     ?? user.Phone;

        // 3. Lưu vào DB
        await _userRepo.UpdateProfileAsync(user);

        // 4. Trả về profile mới
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