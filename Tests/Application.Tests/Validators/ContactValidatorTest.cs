using Xunit;
using Application.Validators;
using FluentValidation.TestHelper;
using Application.Contacts;

namespace Application.Tests.Validators
{
    public class ContactValidatorTest : BaseTest
    {
        [Fact]
        public void Contact_Validation()
        {
            var validator = new ContactValidator();

            validator.ShouldHaveValidationErrorFor(x => x.Name, new ContactViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.Email, new ContactViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.Type, new ContactViewModel());

            validator.ShouldHaveValidationErrorFor(x => x.Name, "")
                    .WithErrorMessage("Name can not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.Email, "")
                    .WithErrorMessage("Email can not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.Email, "abc123")
                    .WithErrorMessage("Invalid email address.");
            validator.ShouldHaveValidationErrorFor(x => x.Type, "")
                    .WithErrorMessage("Select type.");
            
            validator.ShouldNotHaveValidationErrorFor(x => x.Name, "name");
            validator.ShouldNotHaveValidationErrorFor(x => x.Email, "email@gmail.com");
            validator.ShouldNotHaveValidationErrorFor(x => x.Type, "client");
        }
    }
}
