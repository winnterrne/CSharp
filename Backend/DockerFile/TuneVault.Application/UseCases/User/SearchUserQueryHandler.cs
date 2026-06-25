using MediatR;
using TuneVault.Application.DTos;
using TuneVault.Application.DTOs;
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

    public async Task<IEnumerable<UserProfileDto>> Handle(SearchUserQuery request,CancellationToken cancellationToken)
    {
        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

        var skip = (pageNumber - 1) * pageSize;
        var take = pageSize;

        var result = await _userRepo.SearchAsync(request.Keyword, skip, take);

        return result.Users.Select(u => new UserProfileDto
        (
            u.UserID,
            u.UserName,
            u.UserImage,
            u.Email,
            u.Role,
            u.Phone,
            u.Bio
        ));
    }
}