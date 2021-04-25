using Application.Contacts;
using Application.Orders.ViewModels;
using Application.Users.ViewModels;
using Domain;
using FluentValidation;

namespace Application.Validators
{
    public class AddContactValidator : AbstractValidator<ContactViewModel>
    {
        public AddContactValidator()
        {
            RuleFor(m => m.Email).NotEmpty().WithMessage("Email can not be empty.");
            // RuleFor(m => m.Company).NotEmpty().WithMessage("Email can not be empty");;
            RuleFor(m => m.Type).NotEmpty().WithMessage("Select type.");
            RuleFor(m => m.Name).Name();
        }
    }
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
    public class EditUserValidator : AbstractValidator<User>
    {
        public EditUserValidator()
        {
            RuleFor(m => m.UserName).NotEmpty().WithMessage("Username must not be empty.")
                                    .MinimumLength(4).WithMessage("Username must contain more than 3 letters.");
            RuleFor(m => m.DisplayName).NotEmpty().WithMessage("Name to display must not be empty.")
                                    .MinimumLength(4).WithMessage("Name to display must contain more than 3 letters."); ;
            // RuleFor(m => m.Password).Password().NotEmpty().WithMessage("Password must not be empty");
            RuleFor(m => m.Email).NotEmpty().WithMessage("Email must not be empty");
        }
    }
    public class AddOrderValidator : AbstractValidator<Order>
    {
        public AddOrderValidator()
        {
            RuleFor(p => p.Amount).NotEmpty().WithMessage("Amount must not be empty.")
                                    .GreaterThanOrEqualTo(5).WithMessage("Amount must be greather than 5 pieces.");
            RuleFor(p => p.Price).NotEmpty().WithMessage("Price to display must not be empty.")
                                    .GreaterThanOrEqualTo(20).WithMessage("Minimum price is 20$.");
            // RuleFor(m => m.Password).Password().NotEmpty().WithMessage("Password must not be empty");
            RuleFor(p => p.Client).NotEmpty().WithMessage("Select client.");
        }
    }
}