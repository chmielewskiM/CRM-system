using Xunit;
using Application.Validators;
using FluentValidation.TestHelper;
using Application.DelegatedTasks;
using System;

namespace Application.Tests.Validators
{
    public class TaskValidatorTest : BaseTest
    {
        [Fact]
        public void Task_Validation()
        {
            var validator = new TaskValidator();

            validator.ShouldHaveValidationErrorFor(x => x.Deadline, new DelegatedTaskViewModel());
            validator.ShouldHaveValidationErrorFor(x => x.Type, new DelegatedTaskViewModel());

            validator.ShouldHaveValidationErrorFor(x => x.Deadline, new DateTime())
                    .WithErrorMessage("Deadline can not be empty.");
            validator.ShouldHaveValidationErrorFor(x => x.Type, "")
                    .WithErrorMessage("Select type.");


            validator.ShouldNotHaveValidationErrorFor(x => x.Deadline, DateTime.Now);
            validator.ShouldNotHaveValidationErrorFor(x => x.Type, "Order");
        }
    }
}
