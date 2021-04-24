using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Users.Queries;
using Application.Users.ViewModels;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.QueryHandlers
{
    public class LoginUserQueryHandler : IRequestHandler<LoginUserQuery, UserViewModel>
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtGenerator _jwtGenerator;

        public LoginUserQueryHandler(UserManager<User> userManager, SignInManager<User> signInManager,
        IJwtGenerator jwtGenerator)
        {
            _jwtGenerator = jwtGenerator;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<UserViewModel> Handle(LoginUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            // if (user == null)
            //     throw new RestException(HttpStatusCode.Unauthorized, new { message = "Authorization failure." });

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (result.Succeeded)
            {
                return new UserViewModel
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Level = user.Level,
                };
            }

            throw new RestException(HttpStatusCode.Unauthorized, new { message = "Authorization failure." });
        }
    }
}