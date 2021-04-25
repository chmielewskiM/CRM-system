using System.Threading;
using System.Threading.Tasks;
using Application.Users.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Users.QueryHandlers
{
    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, User>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public GetUserQueryHandler(DataContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<User> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(request.Username);

            return user;
        }
    }
}