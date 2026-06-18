using System;
using Microsoft.AspNetCore.Http;
using TuneVault.Domain.Entities;
namespace TuneVault.Application.DTOs;
public record ArtistDto(
    int ArtistID,
    string? ArtistName,
    string? ArtistImage
);
public record ArtistProfileDto(
    int ArtistID,
    string? ArtistName,
    string? ArtistImage,
    string? Bio
);

public record SearchArtistResultDto(
    IEnumerable<ArtistProfileDto> Artists,
    int TotalPages);

    
public record ArtistFollowerDto(
    int ArtistID,
    string? ArtistName,
    string? ArtistImage
);