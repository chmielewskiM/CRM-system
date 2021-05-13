using Application.Leads.ViewModels;
using FluentValidation;

namespace Application.Validators
{
    public class LeadValidator : AbstractValidator<LeadViewModel>
    {
        public LeadValidator()
        {
            RuleFor(m => m.Contact.Email).NotEmpty().WithMessage("Email can not be empty.");
            RuleFor(m => m.Contact.Type).NotEmpty().WithMessage("Select type.");
            RuleFor(m => m.Contact.Source).NotEmpty().WithMessage("Select source.");
            RuleFor(m => m.Contact.Name).Name();
        }
    }
}