using Application.Orders.ViewModels;
using FluentValidation;

namespace Application.Validators
{
    public class OrderValidator : AbstractValidator<OrderViewModel>
    {
        public OrderValidator()
        {
            RuleFor(p => p.Amount).NotNull().NotEmpty().WithMessage("Amount must not be empty.")
                                    .GreaterThanOrEqualTo(5).WithMessage("Amount must be greather than 5 pieces.");
            RuleFor(p => p.Price).NotEmpty().WithMessage("Price must not be empty.")
                                    .GreaterThanOrEqualTo(20).WithMessage("Minimum price is 20$.");
            RuleFor(p => p.ClientName).NotEmpty().WithMessage("Select client.");
        }
    }
}