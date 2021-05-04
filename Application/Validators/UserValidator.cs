using Application.Users.ViewModels;
using FluentValidation;

namespace Application.Validators
{
    public class RegisterUserValidator : AbstractValidator<UserViewModel>
    {
        public RegisterUserValidator()
        {
            RuleFor(m => m.Username).NotEmpty().WithMessage("Username must not be empty.")
                                    .MinimumLength(4).WithMessage("Username must contain more than 3 letters.");
            RuleFor(m => m.DisplayName).NotEmpty().WithMessage("Name to display must not be empty.")
                                    .MinimumLength(4).WithMessage("Name to display must contain more than 3 letters."); ;
            RuleFor(m => m.Password).Password().NotEmpty().WithMessage("Password must not be empty");
            RuleFor(m => m.Email).NotEmpty().WithMessage("Email must not be empty");
        }
    }
}