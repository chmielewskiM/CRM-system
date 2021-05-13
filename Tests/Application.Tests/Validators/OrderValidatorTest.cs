using Xunit;
using Application.Validators;
using FluentValidation.TestHelper;
using Application.Orders.ViewModels;

namespace Application.Tests.Validators
{
    public class OrderValidatorTest : BaseTest
    {
        [Fact]
        public void Order_Validation()
        {
            var validator = new OrderValidator();

            validator.ShouldHaveValidationErrorFor(x => x.Amount, new OrderViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.Price, new OrderViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.ClientName, new OrderViewModel());

            validator.ShouldHaveValidationErrorFor(x => x.Amount, 0)
                    .WithErrorMessage("Amount must not be empty.");            
            validator.ShouldHaveValidationErrorFor(x => x.Amount, 3)
                    .WithErrorMessage("Amount must be greather than 5 pieces.");
            validator.ShouldHaveValidationErrorFor(x => x.Price, 0)
                    .WithErrorMessage("Price must not be empty.");            
            validator.ShouldHaveValidationErrorFor(x => x.Price, 19)
                    .WithErrorMessage("Minimum price is 20$.");
            validator.ShouldHaveValidationErrorFor(x => x.ClientName, "")
                    .WithErrorMessage("Select client.");

            validator.ShouldNotHaveValidationErrorFor(x => x.Amount, 6);
            validator.ShouldNotHaveValidationErrorFor(x => x.Price, 21);
            validator.ShouldNotHaveValidationErrorFor(x => x.ClientName, "client");
        }
    }
}
