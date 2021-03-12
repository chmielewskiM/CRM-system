using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class CloseOrder
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Boolean Closed { get; set; }
            public DateTime DateOrderClosed { get; set; }
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
                var order = await _context.Orders.FindAsync(request.Id);

                if (order == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { delegatedTask = "Not found" });


                order.Closed = true;

                order.DateOrderClosed = DateTime.Now;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}