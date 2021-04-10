using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
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
                // RuleFor(x => x.Name).NotEmpty();
                // RuleFor(x => x.Type).NotEmpty();
                // RuleFor(x => x.Company).NotEmpty();
                // RuleFor(x => x.PhoneNumber).NotEmpty();
                // RuleFor(x => x.Email).NotEmpty();
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
                var user = await _context.Users.FindAsync(request.Id);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { msg = "User not found" });

                user.UserName = request.Username;
                user.DisplayName = request.DisplayName;
                user.Email = request.Email;
                user.Level = request.Level;

                var success = await _context.SaveChangesAsync() > 0;
                var success2 = await _context.SaveChangesAsync();

                if (request.Password != null)
                {
                    //generate reset password token
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    //reset user's password
                    await _userManager.ResetPasswordAsync(user, token, request.Password);

                }

                //save changes to user manager
                await _userManager.UpdateAsync(user);

                if (success) return Unit.Value;

                throw new RestException(HttpStatusCode.Conflict, "No changes detected.");
            }
        }
    }
}