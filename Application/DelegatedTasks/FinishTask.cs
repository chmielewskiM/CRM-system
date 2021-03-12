using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
    public class FinishTask
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

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                               x.UserName == _userAccessor.GetLoggedUsername());

                if (delegatedTask == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { delegatedTask = "Not found" });

                delegatedTask.Accepted = false;
                delegatedTask.Refused = false;
                delegatedTask.FinishedBy = user.DisplayName;
                delegatedTask.Pending = false;
                delegatedTask.Done = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");

            }
        }
    }
}