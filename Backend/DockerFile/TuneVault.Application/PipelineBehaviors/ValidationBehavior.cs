using System.ComponentModel.DataAnnotations;
using FluentValidation;
using MediatR;

namespace TuneVault.Application.PipelineBehaviors;

public class ValidationBehavior<TRequest, TResponse> 
: IPipelineBehavior<TRequest, TResponse> 
where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if(_validators.Count() > 0)
        {
            var context = new ValidationContext<TRequest>(request);
            var failures = _validators.Select(v => v.Validate(context))
                            .SelectMany(r => r.Errors)
                            .Where(e => e != null)
                            .ToList();

            if(failures.Count > 0)
            {
                throw new FluentValidation.ValidationException(failures);
            }
        }
        return await next(cancellationToken);
    }
}