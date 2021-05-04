using System;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Validators;
using AutoMapper;
using Domain;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

namespace API.Controllers
{
    [EnableCors("CorsPolicy")]
    [AllowAnonymous]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        protected IMapper _mapper;
        protected IUserAccessor _userAccessor;
        protected DataContext _context;
        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
        protected IMapper Mapper => _mapper ?? (_mapper = HttpContext.RequestServices.GetService<IMapper>());
        protected IUserAccessor UserAccessor => _userAccessor ?? (_userAccessor = HttpContext.RequestServices.GetService<IUserAccessor>());
        protected DataContext Context => _context ?? (_context = HttpContext.RequestServices.GetService<DataContext>());
    }
}