using System;
using Microsoft.AspNetCore.Http;
using TuneVault.Domain.Entities;

public record ArtistDto(
    int ArtistID,
    string? ArtistName,
    string? ArtistImage
);
public record ArtistProfileDto(
    int ArtistID,
    string? ArtistName,
    string? ArtistImage,
    string? Bio,
    int Followers
);