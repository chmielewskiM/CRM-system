using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace Application.Orders
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

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var order = await _context.Orders.FindAsync(request.Id);

                if (order == null)
                    throw new RestException(HttpStatusCode.NotFound, "Couldn't find the order." );

                Contact client = await _context.Contacts.FindAsync(order.ClientId);

                if (client == null)
                    throw new RestException(HttpStatusCode.Conflict, "Something went wrong. The order appears to have no client assigned.");

                if (client.Status == "Invoice")
                    throw new RestException(HttpStatusCode.Forbidden, "You can't delete an order which is waiting for finalization. Downgrade client's status first.");

                await Operations.DeleteOperation.deleteOperation(order.DateOrderOpened, _context, new Guid(order.UserId));

                _context.Remove(order);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
}
        }
    }
}