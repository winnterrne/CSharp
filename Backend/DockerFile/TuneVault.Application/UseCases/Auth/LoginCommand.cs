using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Auth;

//<summary>
// Command để xử lý đăng nhập người dùng
// Trả về AuthResponseDTO chứa token và thông tin người dùng nếu đăng nhập thành công
//</summary>
public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResponseDto>;