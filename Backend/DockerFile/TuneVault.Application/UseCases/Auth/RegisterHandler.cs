using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Auth;
//<summary>
// Handler để xử lý đăng ký người dùng mới 
// Sử dụng IUserRepository để tạo người dùng mới trong database 
// Sử dụng IJwtService để tạo JWT token nếu đăng ký thành công
// Trả về AuthResponseDTO chứa token và thông tin người dùng nếu đăng ký thành công
//</summary>
public class RegisterHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwtService;

    public RegisterHandler(IUserRepository userRepo, IJwtService jwtService)
    {
        _userRepo = userRepo;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(
        RegisterCommand request,
        CancellationToken cancellationToken)
    {
        if (await _userRepo.EmailExistsAsync(request.Email))
            throw new Exception("Email đã được sử dụng");

        var user = new AspNetUsers
        {
            UserID   = Guid.NewGuid().ToString(),
            UserName = request.UserName,
            Email    = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role     = "User",
            Phone    = request.Phone
        };

        await _userRepo.CreateUserAsync(user);

        var token = _jwtService.GenerateToken(user);
        return new AuthResponseDto(
            user.UserID, user.UserName!, user.Email!, user.Role!, token, user.UserImage
        );
    }
}