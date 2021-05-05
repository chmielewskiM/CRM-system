using Application.Leads.ViewModels;
using FluentValidation;

namespace Application.Validators
{
    public class AddLeadValidator : AbstractValidator<LeadViewModel>
    {
        public AddLeadValidator()
        {
            RuleFor(m => m.Contact.Email).NotEmpty().WithMessage("Email can not be empty.");
            RuleFor(m => m.Contact.Source).NotEmpty().WithMessage("Source can not be empty.");
            RuleFor(m => m.Contact.Name).Name();
        }
    }
}