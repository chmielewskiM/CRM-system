
using System.Threading.Tasks;
using MediatR;
using Persistence;
using System.Threading;
using System;
using Microsoft.AspNetCore.Identity;
using Domain;
using Application.Users.Commands;
using Application.Errors;
using System.Net;

namespace Application.Users.CommandHandlers
{
    public class EditUserCommandHandler : IRequestHandler<EditUserCommand>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public EditUserCommandHandler(DataContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<Unit> Handle(EditUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync(request.Id);
            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { message = "User not found" });

            if (request.Password != null)
            {
                //generate reset password token
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                //reset user's password
                await _userManager.ResetPasswordAsync(user, token, request.Password);
            }

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
