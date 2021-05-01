using Domain;
using FluentValidation;

namespace Application.Validators
{
    public class AddLeadValidator : AbstractValidator<Lead>
    {
        public AddLeadValidator()
        {
            RuleFor(m => m.Contact.Email).NotEmpty().WithMessage("Email can not be empty.");
            RuleFor(m => m.Contact.Type).NotEmpty().WithMessage("Select type.");
            RuleFor(m => m.Contact.Name).Name();
        }
    }
}