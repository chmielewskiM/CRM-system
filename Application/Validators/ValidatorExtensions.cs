using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .MinimumLength(8).WithMessage("Password must be at least 12 characters")
            .Matches("[A-Z]").WithMessage("Password must contain at least 1 uppercase letter")
            .Matches("[a-z]").WithMessage("Password must contain at least 1 lowercase letter")
            .Matches("[0-9]").WithMessage("Password must contain at least one number");

            return options;
        }

        public static IRuleBuilder<T, string> Name<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .NotEmpty().WithMessage("Name can not be empty.")
            .MinimumLength(4).WithMessage("Name must be at least 4 characters.")
            .Matches("[^0-9]").WithMessage("Name must contain letters.");

            return options;
        }
    }
}