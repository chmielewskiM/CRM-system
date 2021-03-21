using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.AppUser;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Microsoft.AspNetCore.Identity;

namespace Application.DelegatedTasks
{
    public class ShareTask
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public User User { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<User> _userManager;

            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<User> userManager)
            {
                _userManager = userManager;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var task = await _context
                    .DelegatedTasks
                    .FindAsync(request.Id);
                if (task == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Task = "Could not find task"
                    });
                
                var user = await _userManager.FindByNameAsync(_userAccessor.GetLoggedUsername());
                var targetUser = await _userManager.FindByNameAsync(request.Username);

                var share = await _context
                    .UserTasks
                    .SingleOrDefaultAsync(x => x.DelegatedTaskId == task.Id && x.SharedWith.Id == user.Id);

                if (share != null)
                    throw new RestException(HttpStatusCode.BadRequest,
                    new { Assign = "Already shared with this employee" });

                task.Accepted = false;
                task.Refused = false;
                task.Pending = true;

                share = await _context.UserTasks.SingleOrDefaultAsync(x => x.DelegatedTask == task);

                share.SharedWith = targetUser;
                share.SharedWithId = targetUser.Id;

                // _context.UserTasks.Add(share);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
    }
}