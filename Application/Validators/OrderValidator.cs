using Application.Orders.ViewModels;
using Domain;
using FluentValidation;

namespace Application.Validators
{
    public class AddOrderValidator : AbstractValidator<OrderViewModel>
    {
        public AddOrderValidator()
        {
            RuleFor(p => p.Amount).NotNull().NotEmpty().WithMessage("Amount must not be empty.")
                                    .GreaterThanOrEqualTo(5).WithMessage("Amount must be greather than 5 pieces.");
            RuleFor(p => p.Price).NotEmpty().WithMessage("Price to display must not be empty.")
                                    .GreaterThanOrEqualTo(20).WithMessage("Minimum price is 20$.");
            RuleFor(p => p.Product).NotEmpty().WithMessage("Select Product.");
        }
    }
}