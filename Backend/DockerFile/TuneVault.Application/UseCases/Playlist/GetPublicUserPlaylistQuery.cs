// GetPublicUserPlaylistQuery.cs
using MediatR;
public record GetPublicUserPlaylistQuery(string UserId) : IRequest<object>;