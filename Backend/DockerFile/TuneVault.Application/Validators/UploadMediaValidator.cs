using System.Data;
using FluentValidation;
using TuneVault.Application.UseCases.MediaItem.MediaUploading;

namespace TuneVault.Application.Validators;

public class UploadMediaValidator : AbstractValidator<UploadMediaCommand>
{
    private readonly string[] _allowedAudioTypes = {".mp3", ".wav"};
    private readonly string[] _allowedVideoTypes = {".mp4", ".webm"};
    private const long MaxAudioSize = 20 * 1024 * 1024;
    private const long MaxVideoSize = 100 * 1024 * 1024;

    public UploadMediaValidator()
    {
        RuleFor(x => x.TitleName)
        .NotEmpty().WithMessage("Tên bài hát không được để trống")
        .MaximumLength(255).WithMessage("Tên bài hát tối đa 255 ký tự");

        RuleFor(x => x.MediaItemType)
        .NotEmpty().WithMessage("Loại media không được để trống")
        .Must(t => t == "audio" || t == "video")
        .WithMessage("Loại media phải là 'audio' hoặc 'video' ");

        RuleFor(x => x.File)
        .NotNull().WithMessage("File không được để trống")
        .Must((cmd, file) => ValidateFileExtension(cmd))
        .WithMessage("Định dạng file không được phép")
        .Must((cmd, file) => ValidateFileSize(cmd))
        .WithMessage("File quá lớn");
    }

    private bool ValidateFileExtension(UploadMediaCommand cmd)
    {
        var ext = Path.GetExtension(cmd.File.FileName).ToLower();
        return cmd.MediaItemType == "audio" ? _allowedAudioTypes.Contains(ext) : _allowedVideoTypes.Contains(ext);
    }
    private bool ValidateFileSize(UploadMediaCommand cmd)
    {
        return cmd.MediaItemType == "audio" ?  cmd.File.Length <= MaxAudioSize : cmd.File.Length <= MaxVideoSize;
    }
    
    
}