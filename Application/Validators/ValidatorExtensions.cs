using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .NotEmpty()
            .MinimumLength(5).WithMessage("Password must be at least 5 characters");
            // .Matches("[A-Z]").WithMessage("Password contain at least 1 uppercase letter")
            // .Matches("[a-z]").WithMessage("Password must contain at least 1 lowercase letter")
            // .Matches("[0-9]").WithMessage("Password must contain at least one number");

            return options;
        }
    }
}