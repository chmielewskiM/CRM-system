using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using Application.Errors;
using System.Net;

namespace Application.AppUser
{
    public class GetUser
    {
        public class Query : IRequest<AppUser>
        {

            public String Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, AppUser>
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

            public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(request.Username);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { message = "User not found" });

                return new AppUser
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Level = user.Level,
                    Email = user.Email,
                };
            }
        }
    }
}