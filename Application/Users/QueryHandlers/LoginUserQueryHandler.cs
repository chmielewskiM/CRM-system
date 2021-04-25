using System.Threading;
using System.Threading.Tasks;
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
            var result = await _signInManager.CheckPasswordSignInAsync(request.User, request.Password, false);

            if (result.Succeeded)
            {
                return new UserViewModel
                {
                    DisplayName = request.User.DisplayName,
                    Username = request.User.UserName,
                    Token = _jwtGenerator.CreateToken(request.User),
                    Level = request.User.Level,
                };
            }

            return null;
        }
    }
}