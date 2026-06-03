using Microsoft.Extensions.Configuration;
using TuneVault.Application.Interfaces;

namespace TuneVault.Infrastructure.FileStorage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _mediaRootPath;

    public LocalFileStorageService (IConfiguration configuration)
    {
        _mediaRootPath = configuration["MediaStorage:RootPath"]
        ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "media");
    }

    public async Task<string> SaveFileAsync(
        Stream fileStream,
        string fileName,
        string folder
    )
    {
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var folderPath = Path.Combine(_mediaRootPath, folder);

        Directory.CreateDirectory(folderPath);

        var fullPath = Path.Combine(folderPath, uniqueFileName);
        using var fileOutput = new FileStream(fullPath, FileMode.Create);
        await fileStream.CopyToAsync(fileOutput);
        return $"/media/{folder}/{uniqueFileName}";
    }

    public async Task DeleteFileAsync(string filePath)
    {
        var fullPath = Path.Combine(_mediaRootPath, filePath.TrimStart('/').Replace("media/",""));
        if(File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
        await Task.CompletedTask;
    }
}