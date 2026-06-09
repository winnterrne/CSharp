using System;
using Microsoft.AspNetCore.Http;
using TuneVault.Domain.Entities;

public record ArtistDto(
    int ArtistID,
    string? ArtistName,
    string? ArtistImage
);