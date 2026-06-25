using FluentValidation;
using TuneVault.Application.UseCases;
namespace TuneVault.Application.Validators;

public class SearchMediaValidator : AbstractValidator<SearchMediaQuery>
{
    public SearchMediaValidator()
    {
        RuleFor(x => x.KeyWord).NotEmpty().WithMessage("Từ khóa tìm kiếm không được bỏ trống.");
        RuleFor(x => x.PageNumber).GreaterThanOrEqualTo(1).WithMessage("Số tràn phải từ 1 trở lên.");
        RuleFor(x => x.PageSize).GreaterThanOrEqualTo(1).WithMessage("Kích thước trang phải lớn hơn 0.");
    }
}