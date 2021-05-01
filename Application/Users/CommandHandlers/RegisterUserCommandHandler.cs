
using System.Threading.Tasks;
using MediatR;
using Persistence;
using System.Threading;
using System;
using Application.Users.Commands;
using Microsoft.AspNetCore.Identity;
using Application.Interfaces;
using Domain;
using System.Linq;
using Application.Errors;
using System.Net;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.CommandHandlers
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IJwtGenerator _jwtGenerator;
        public RegisterUserCommandHandler(DataContext context, UserManager<User> userManager, IJwtGenerator jwtGenerator)
        {
            _jwtGenerator = jwtGenerator;
            _userManager = userManager;
            _context = context;
        }

        public async Task<Unit> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
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

            if (result.Succeeded) return Unit.Value;

            throw new Exception("Problem creating user");
        }
    }
}
