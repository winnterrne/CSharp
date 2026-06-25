using System.Data;
using FluentValidation;
using TuneVault.Application.UseCases.Share;

namespace TuneVault.Application.Validators;

public class ShareMediaValidator : AbstractValidator<ShareMediaCommand>
{
    public ShareMediaValidator()
    {
        RuleFor(x => x.ReceiverID).NotEmpty().WithMessage("Người nhận không được để trống");
        
        RuleFor(x => x).Must(x => x.SenderID != x.ReceiverID).WithMessage("Không thể chia sẻ cho chính mình");

        RuleFor(x => x).Must(x => x.MediaItemID.HasValue || x.PlaylistID.HasValue)
        .WithMessage("Phải chọn bài hát hoặc Playlist để chia sẻ");
    }
}