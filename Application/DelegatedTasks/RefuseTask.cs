using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks
{
    public class RefuseTask
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);

                if (delegatedTask == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { delegatedTask = "Not found" });

                delegatedTask.Refused = true;
                delegatedTask.Accepted = false;
                delegatedTask.Pending = false;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");

            }
        }
    }
}