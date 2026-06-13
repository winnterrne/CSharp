using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class SearchUsersHandler : IRequestHandler<SearchUserQuery, IEnumerable<UserProfileDTO>>
{
    // Tiêm Dependency Injection cho User Repository
    private readonly IUserRepository _userRepo;

    public SearchUsersHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<IEnumerable<UserProfileDTO>> Handle( SearchUserQuery request, CancellationToken cancellationToken)
    {
        int skip = (request.PageNumber - 1) * request.PageSize;

        var users = await _userRepo.SearchAsync(request.Keyword, skip, request.PageSize);

        var userDtos = users.Users.Select(user => new UserProfileDTO(
            user.UserID,
            user.UserName,
            user.UserImage,
            user.Email,
            user.Role,
            user.Phone
        ));

        return userDtos;
    }
}