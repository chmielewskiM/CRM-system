using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.AppUser
{
    public class ListUsers
    {
        public class Query : IRequest<List<User>> { }
        public class Handler : IRequestHandler<Query, List<User>>
        {
            private readonly DataContext _context;
            private readonly ILogger<ListUsers> _logger;
            private readonly UserManager<User> _userManager;

            public Handler(DataContext context, ILogger<ListUsers> logger, UserManager<User> userManager)
            {
                _userManager = userManager;
                _logger = logger;
                _context = context;
            }

            public async Task<List<User>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                var users = await _context.Users.ToListAsync();

                return users;
            }
        }
    }
}