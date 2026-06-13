using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class GetProfileHandler : IRequestHandler<GetProfileQuery, UserProfileDTO>
{
    private readonly IUserRepository _userRepo;

    public GetProfileHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<UserProfileDTO> Handle(
        GetProfileQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepo.GetProfileAsync(request.UserID);
        if(user == null) throw new Exception("Người dùng không tồn tại");
        return new UserProfileDTO(
            user.UserID,
            user.UserName,
            user.UserImage,
            user.Email,
            user.Role,
            user.Phone
        );
    }
}