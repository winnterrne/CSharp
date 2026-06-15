using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class GetProfileHandler : IRequestHandler<GetProfileQuery, UserProfileDto>
{
    private readonly IUserRepository _userRepo;

    public GetProfileHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<UserProfileDto> Handle(
        GetProfileQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepo.GetProfileAsync(request.UserID);
        if(user == null) throw new Exception("Người dùng không tồn tại");
        return new UserProfileDto(
            user.UserID,
            user.UserName,
            user.UserImage,
            user.Email,
            user.Role,
            user.Phone
        );
    }
}