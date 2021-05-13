using Xunit;
using Application.Validators;
using FluentValidation.TestHelper;
using Application.Users;
using Application.Users.ViewModels;

namespace Application.Tests.Validators
{
    public class UserValidatorTest : BaseTest
    {
        [Fact]
        public void User_Validation()
        {
            var validator = new UserValidator();

            validator.ShouldHaveValidationErrorFor(x => x.Username, new UserViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.DisplayName, new UserViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.Email, new UserViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.Password, new UserViewModel());

            validator.ShouldHaveValidationErrorFor(x => x.Username, "")
                    .WithErrorMessage("Username must not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.Username, "Abc")
                    .WithErrorMessage("Username must contain more than 3 letters.");
            validator.ShouldHaveValidationErrorFor(x => x.DisplayName, "")
                    .WithErrorMessage("Name to display must not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.DisplayName, "Abc")
                    .WithErrorMessage("Name to display must contain more than 3 letters.");
            validator.ShouldHaveValidationErrorFor(x => x.Email, "")
                    .WithErrorMessage("Email must not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.Password, "")
                    .WithErrorMessage("Password must not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.Password, "Abc")
                    .WithErrorMessage("Password must be at least 12 characters");
            validator.ShouldHaveValidationErrorFor(x => x.Password, "1bcdefghijklmnopr")
                    .WithErrorMessage("Password must contain at least 1 uppercase letter");
            validator.ShouldHaveValidationErrorFor(x => x.Password, "Abcdefghijklmnopr")
                    .WithErrorMessage("Password must contain at least one number");

            validator.ShouldNotHaveValidationErrorFor(x => x.Username, "name");
            validator.ShouldNotHaveValidationErrorFor(x => x.DisplayName, "display");
            validator.ShouldNotHaveValidationErrorFor(x => x.Email, "email@gmail.com");
            validator.ShouldNotHaveValidationErrorFor(x => x.Password, "123456ABCdef");
        }
    }
}
