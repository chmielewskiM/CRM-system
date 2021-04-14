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
using System.Linq;
using Application.Errors;
using System.Net;

namespace Application.AppUser
{
    public class DeleteUser
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _userManager.FindByNameAsync(request.Username);
                    IQueryable<UserTask> userTasks = _context.UserTasks.Where(x => x.SharedWith == user);

                    foreach (UserTask userTask in userTasks)
                    {
                        userTask.SharedWith = null;
                        userTask.SharedWithId = null;
                        userTask.DelegatedTask.Pending = false;
                    }

                    IQueryable<DelegatedTask> tasks = _context.DelegatedTasks.Where(x => x.UserTask.CreatedBy == user);

                    _context.DelegatedTasks.RemoveRange(tasks);

                    _context.Users.Remove(user);

                    await _userManager.DeleteAsync(user);

                    await _context.SaveChangesAsync();

                    return Unit.Value;
                }
                catch
                {

                    throw new Exception("Failed to delete the user.");
                }



                // throw new Exception("Failed to delete the user.");
            }
        }
    }
}