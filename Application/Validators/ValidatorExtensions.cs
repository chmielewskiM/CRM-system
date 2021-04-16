using System;
using System.Net;
using Application.Errors;
using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .MinimumLength(8).OnFailure(x => brokenRule("Password must be at least 8 characters"))
            .Matches("[A-Z]").OnFailure(x => brokenRule("Password must contain at least 1 uppercase letter"))
            .Matches("[a-z]").OnFailure(x => brokenRule("Password must contain at least 1 lowercase letter"))
            .Matches("[0-9]").OnFailure(x => brokenRule("Password must contain at least one number"));

            return options;
        }

        public static IRuleBuilder<T, string> Name<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .NotEmpty().OnFailure(x => brokenRule("Name can not be empty."))
            .MinimumLength(4).OnFailure(x => brokenRule("Name must be at least 4 characters."))
            .Matches("[^0-9]").OnFailure(x => brokenRule("Name can not contain numbers."));

            return options;
        }

        public static Action<RestException> brokenRule(string message)
        {
            throw new RestException(HttpStatusCode.BadRequest, new { message = message });
        }
    }

}