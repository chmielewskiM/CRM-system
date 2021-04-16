using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AppUser
{
    public class RegisterUser
    {
        public class Command : IRequest<AppUser>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Level { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty().Name();
                RuleFor(x => x.Username).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Username can not be empty."));
                RuleFor(x => x.Email).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Email can not be empty."));
                RuleFor(x => x.Password).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Password can not be empty")).Password();
            }
        }

        public class Handler : IRequestHandler<Command, AppUser>
        {
            private readonly DataContext _context;
            private readonly UserManager<User> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(DataContext context, UserManager<User> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _context = context;
            }

            public async Task<AppUser> Handle(Command request, CancellationToken cancellationToken)
            {
                CommandValidator validator = new CommandValidator();
                validator.ValidateAndThrow(request);

                if (await _context.Users.Where(x => x.Email == request.Email).AnyAsync())
                    throw new RestException(HttpStatusCode.BadRequest, new { msg = "This email already exists" });

                if (await _context.Users.Where(x => x.UserName == request.Username).AnyAsync())
                    throw new RestException(HttpStatusCode.BadRequest, new { msg = "This username already exists" });

                var user = new User
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username,
                    Level = request.Level
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new AppUser
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                    };
                }

                throw new Exception("Problem creating user");
            }
        }
    }
}