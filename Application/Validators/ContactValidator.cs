using Application.Contacts;
using FluentValidation;

namespace Application.Validators
{
    public class ContactValidator : AbstractValidator<ContactViewModel>
    {
        public ContactValidator()
        {
            RuleFor(m => m.Email).NotEmpty().WithMessage("Email can not be empty.")
                                .EmailAddress().WithMessage("Invalid email address.");
            RuleFor(m => m.Type).NotEmpty().WithMessage("Select type.");
            RuleFor(m => m.Name).Name();
        }
    }
}