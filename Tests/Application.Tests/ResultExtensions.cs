//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using FluentAssertions;
//using FluentAssertions.Common;
//using FluentAssertions.Execution;
//using FluentAssertions.Primitives;

//namespace FluentAssertionTests.Logics
//{
//    public static class ResultExtensions
//    {
//        public static ResultAssertions<T> Should<T>(this Result<T> instance)
//        {
//            return new ResultAssertions<T>(instance);
//        }
//    }

//    public class ResultAssertions<T> : ReferenceTypeAssertions<Result<T>, ResultAssertions<T>>
//    {
//        public ResultAssertions(Result<T> result)
//        {
//            Subject = result;
//        }

//        protected override string Identifier => "result";

//        public ResultAssertions<T> BeSuccess(T value, string because = "", params object[] becauseArgs)
//        {
//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject != null)
//                .FailWith("The result can't be null.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Success)
//                .FailWith("The Success should be true.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Value.IsSameOrEqualTo(value))
//                .FailWith("The Value should be the same as expected.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Errors != null)
//                .FailWith("The Errors can't be null.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Errors.Any() == false)
//                .FailWith("The Errors can't have any errors.");

//            return this;
//        }

//        public ResultAssertions<T> BeFailure(string property, string message, string because = "", params object[] becauseArgs)
//        {
//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject != null)
//                .FailWith("The result can't be null.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Success == false)
//                .FailWith("The Success should be false.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Value == null)
//                .FailWith("The Value should be null.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Errors != null)
//                .FailWith("The Errors can't be null.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(Subject.Errors.Any())
//                .FailWith("The Errors should have errors.");

//            var error = Subject.Errors.FirstOrDefault(e => e.PropertyName == property);

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(error != null)
//                .FailWith($"The Errors should contains error for property '{property}'.");

//            Execute.Assertion
//                .BecauseOf(because, becauseArgs)
//                .ForCondition(error.Message == message)
//                .FailWith($"The Message for property '{property}' should be '{message}'.");

//            return this;
//        }

//        public ResultAssertions<T> BeFailure(string message, string because = "",
//            params object[] becauseArgs)
//        {
//            BeFailure(String.Empty, message, because, becauseArgs);

//            return this;
//        }
//    }
//}