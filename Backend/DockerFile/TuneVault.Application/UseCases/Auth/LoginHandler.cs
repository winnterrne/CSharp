using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Auth;

//<summary>
// Handler để xử lý đăng nhập người dùng
// Sử dụng IUserRepository để lấy thông tin người dùng từ database
// Sử dụng IJwtService để tạo JWT token nếu đăng nhập thành công
// Trả về AuthResponseDTO chứa token và thông tin người dùng nếu đăng nhập thành công
//</summary>
public class LoginHandler : IRequestHandler<LoginCommand, AuthResponseDTO>
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwtService;

    public LoginHandler(IUserRepository userRepo, IJwtService jwtService)
    {
        _userRepo = userRepo;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDTO> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepo.GetUserByEmailAsync(request.Email);
        if (user == null)
            throw new Exception("Email hoặc mật khẩu không đúng");

        var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        if (!isValid)
            throw new Exception("Email hoặc mật khẩu không đúng");

        var token = _jwtService.GenerateToken(user);
        return new AuthResponseDTO(
            user.UserID, user.UserName!, user.Email!, user.Role!, token
        );
    }
}