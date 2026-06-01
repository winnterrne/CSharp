using FluentValidation;
using TuneVault.Application.UseCases.Auth;

namespace TuneVault.Application.Validators;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName không được để trống")
        .MinimumLength(3).WithMessage("UserName tối thiểu 3 ký tự");

        RuleFor(x => x.Email).NotEmpty().WithMessage("Email không được để trống")
        .EmailAddress().WithMessage("Email không hợp lệ");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password không được để trống")
            .MinimumLength(6).WithMessage("Password tối thiểu 6 ký tự");
    }
}

