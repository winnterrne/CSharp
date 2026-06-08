using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Services;

public class GeminiService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"]!;
    }

    public async Task<string> GenerateDescriptionAsync(
        string title,
        string artist,
        string genre)
    {
        string prompt = $"""
            Hãy viết:

            1. Mô tả ngắn bài hát (2-3 câu)
            2. 5 tag liên quan

            Tên bài hát: {title}
            Ca sĩ: {artist}
            Thể loại: {genre}
            """;

        var body = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = prompt
                        }
                    }
                }
            }
        };

        var content = new StringContent(
            JsonSerializer.Serialize(body),
            Encoding.UTF8,
            "application/json");

        string url =
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

        var response =
            await _httpClient.PostAsync(url, content);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new Exception($"Gemini API error: {response.StatusCode}, body: {errorBody}");
        }
        response.EnsureSuccessStatusCode();

        var json =
            await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);

        return doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString()!;
    }
}