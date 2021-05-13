using Application.DelegatedTasks;
using FluentValidation;

namespace Application.Validators
{
    public class TaskValidator : AbstractValidator<DelegatedTaskViewModel>
    {
        public TaskValidator()
        {
            RuleFor(m => m.Deadline).NotEmpty().WithMessage("Deadline can not be empty.");
            RuleFor(m => m.Type).NotEmpty().WithMessage("Select type.");
        }
    }
}