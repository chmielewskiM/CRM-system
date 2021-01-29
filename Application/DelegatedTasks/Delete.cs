using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken )
            {
                var delegatedTask = await _context
                    .DelegatedTasks
                    .FindAsync(request.Id);

                if (delegatedTask == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Contact = "Could not find delegatedTask"
                    });

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                var share = await _context
                    .UserTasks
                    .SingleOrDefaultAsync(x => x.DelegatedTaskId == delegatedTask.Id && x.UserId == user.Id);

                if (share == null)
                    return Unit.Value;

                if (share.UserId != user.Id)
                    throw new RestException(HttpStatusCode.BadRequest, new { Share = "You cannot unshare this delegatedTask" });

                _context.UserTasks.Remove(share);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
    }
}