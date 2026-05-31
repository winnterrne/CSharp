using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Interfaces;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Auth;

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