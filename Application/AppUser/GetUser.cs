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

namespace Application.AppUser
{
    public class GetUser
    {
        public class Query : IRequest<AppUser> { 

            // public string Username { get; set; }
            public String Username { get; set; }
        }

        public class Handler : IRequestHandler<Query,  AppUser>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly UserManager<User> _userManager;

            public Handler(DataContext context, ILogger<List> logger, UserManager<User> userManager)
            {
                _userManager = userManager;
                _logger = logger;
                _context = context;
            }

            public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
            {
                var user =  await _userManager.FindByNameAsync(request.Username);
                // _userManager.FindByIdAsync
                return new AppUser
                {   
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Level = user.Level,
                    Email = user.Email,
                };
            }
        }
    }
}