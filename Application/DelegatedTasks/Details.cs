using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Errors;
using System.Net;

namespace Application.DelegatedTasks
{
    public class Details
    {
        public class Query : IRequest<DelegatedTask>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, DelegatedTask>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<DelegatedTask> Handle(Query request, CancellationToken cancellationToken)
            {
                var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);

                if (delegatedTask == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { delegatedTask = "Not found" });

                return delegatedTask;
            }
        }
    }
}