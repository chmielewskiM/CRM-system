using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Users.QueryHandlers
{
    public class ListUsersQueryHandler : IRequestHandler<ListUsersQuery, List<User>>
    {
        private readonly DataContext _context;
        private readonly ILogger<ListUsersQueryHandler> _logger;
        private readonly UserManager<User> _userManager;

        public ListUsersQueryHandler(DataContext context, ILogger<ListUsersQueryHandler> logger, UserManager<User> userManager)
        {
            _userManager = userManager;
            _logger = logger;
            _context = context;
        }

        public async Task<List<User>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await _context.Users.ToListAsync();

            return users;
        }
    }
}