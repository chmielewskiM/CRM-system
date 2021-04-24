using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Application.Validators;
using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [EnableCors("CorsPolicy")]
    [AllowAnonymous]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        protected IMapper _mapper;
        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
        protected IMapper Mapper => _mapper ?? (_mapper = HttpContext.RequestServices.GetService<IMapper>());

        public async Task<ActionResult> filterValidationFailures<TValidation, TElement>(TValidation val, TElement elementToValidate) where TValidation : AbstractValidator<TElement> where TElement : class
        {
            var validation = await val.ValidateAsync(elementToValidate);
            if (!validation.IsValid)
            {
                List<ValidationFailure> errors = new List<ValidationFailure>();
                errors.AddRange(validation.Errors);

                return BadRequest(new { message = errors[0].ErrorMessage });
            }
            return NoContent();
        }
    }
}