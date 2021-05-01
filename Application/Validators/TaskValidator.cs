using Application.DelegatedTasks;
using Domain;
using FluentValidation;

namespace Application.Validators
{
    public class AddTaskValidator : AbstractValidator<DelegatedTask>
    {
        public AddTaskValidator()
        {
            RuleFor(m => m.Deadline).NotEmpty().WithMessage("Deadline can not be empty.");
            RuleFor(m => m.Type).NotEmpty().WithMessage("Select type.");
        }
    }
}