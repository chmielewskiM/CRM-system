using Application.Contacts;
using Domain;
using FluentValidation;

namespace Application.Validators
{
    public class AddContactValidator : AbstractValidator<ContactViewModel>
    {
        public AddContactValidator()
        {
            RuleFor(m => m.Email).NotEmpty().WithMessage("Email can not be empty.");
            RuleFor(m => m.Type).NotEmpty().WithMessage("Select type.");
            RuleFor(m => m.Name).Name();
        }
    }
}