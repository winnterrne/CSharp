using MediatR;
using TuneVault.Application.Dtos;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Auth;

//<summary>
// Command để xử lý đăng ký người dùng mới
// Trả về AuthResponseDTO chứa token và thông tin người dùng nếu đăng ký thành công
//</summary>
public record RegisterCommand(
    string UserName,
    string Email,
    string Password,
    string? Phone
) : IRequest<AuthResponseDto>;