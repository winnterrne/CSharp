using MediatR;
using TuneVault.Application.Dtos;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User;

public class SearchUsersHandler : IRequestHandler<SearchUserQuery, IEnumerable<UserProfileDto>>
{
    // Tiêm Dependency Injection cho User Repository
    private readonly IUserRepository _userRepo;

    public SearchUsersHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<IEnumerable<UserProfileDto>> Handle( SearchUserQuery request, CancellationToken cancellationToken)
    {
        int skip = (request.PageNumber - 1) * request.PageSize;

        var users = await _userRepo.SearchAsync(request.Keyword, skip, request.PageSize);

        var userDtos = users.Users.Select(user => new UserProfileDto(
            user.UserID,
            user.UserName,
            user.UserImage,
            user.Email,
            user.Role,
            user.Phone,
            user.Bio
        ));

        return userDtos;
    }
}