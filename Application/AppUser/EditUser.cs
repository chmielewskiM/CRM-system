using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.AppUser
{
    public class EditUser
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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
            }
            public void addEditPasswordRule()
            {
                this.RuleFor(x => x.Password).NotEmpty().OnFailure(x => ValidatorExtensions.brokenRule("Password can not be empty")).Password();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly UserManager<User> _userManager;

            public Handler(DataContext context, UserManager<User> userManager)
            {
                _context = context;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //Fluent validation
                CommandValidator validator = new CommandValidator();
                //there is a possibility to omit editing password, if user types anything in the field then the rule is added to validator
                if (request.Password != null) validator.addEditPasswordRule();
                validator.ValidateAndThrow(request);

                var user = await _context.Users.FindAsync(request.Id);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { message = "User not found" });

                bool noChanges = (
                user.UserName == request.Username &&
                user.DisplayName == request.DisplayName &&
                user.Email == request.Email &&
                user.Level == request.Level);

                if (request.Password != null)
                {
                    //generate reset password token
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    //reset user's password
                    await _userManager.ResetPasswordAsync(user, token, request.Password);

                }

                if (noChanges && request.Password == null)
                    throw new NoChangesException();

                user.UserName = request.Username;
                user.DisplayName = request.DisplayName;
                user.Email = request.Email;
                user.Level = request.Level;

                var success = await _context.SaveChangesAsync() > 0;
                //save changes to user manager
                await _userManager.UpdateAsync(user);

                if (success || request.Password != null) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}