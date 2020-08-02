using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Client { get; set; }
            public string Product { get; set; }
            public Double Amount { get; set; }
            public Double Price { get; set; }
            public string DateOrderOpened { get; set; }
            public string Deadline { get; set; }
            public string DateOrderClosed { get; set; }
            public string Notes { get; set; }
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
                    throw new Exception("Could not find order");

                order.Client = request.Client ?? order.Client;
                order.Product = request.Product ?? order.Product;
                order.Amount = request.Amount;
                order.Price = request.Price;
                order.DateOrderOpened = request.DateOrderOpened ?? order.DateOrderOpened;
                order.Deadline = request.Deadline ?? order.Deadline;
                order.DateOrderClosed = request.DateOrderClosed ?? order.DateOrderClosed;
                order.Notes = request.Notes ?? order.Notes;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}