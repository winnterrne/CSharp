using MediatR;
using System.Collections.Generic;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Entities;

public record GetRecommendationsQuery(
    string UserID
): IRequest<List<MediaItemRecommendationDto>>;