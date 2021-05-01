using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ValidatorInterceptor : IValidatorInterceptor
    {
        public FluentValidation.Results.ValidationResult AfterMvcValidation(ControllerContext controllerContext, IValidationContext commonContext, FluentValidation.Results.ValidationResult result)
        {
            if (!result.IsValid)
            {
                var error = result.Errors[0].ErrorMessage;
                controllerContext.ModelState.AddModelError("message", error);
            }
            return result;
        }

        public IValidationContext BeforeMvcValidation(ControllerContext controllerContext, IValidationContext commonContext)
        {
            return commonContext;
        }
    }
}