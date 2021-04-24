using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Users.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.QueryHandlers
{
    public class LoggedUserQueryHandler : IRequestHandler<LoggedUserQuery, User>
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IUserAccessor _userAccessor;
        public LoggedUserQueryHandler(UserManager<User> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _jwtGenerator = jwtGenerator;
            _userManager = userManager;
        }
        public async Task<User> Handle(LoggedUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(_userAccessor.GetLoggedUsername());

            return user;
        }
    }
}