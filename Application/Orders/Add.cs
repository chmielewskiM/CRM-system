using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using System.Linq;

namespace Application.Orders
{
    public class Add
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public int OrderNumber { get; set; }
            public Guid ClientId { get; set; }
            public Contact Client { get; set; }
            public Boolean Type { get; set; }
            public Boolean Closed { get; set; }
            public string Product { get; set; }
            public Double Amount { get; set; }
            public Double Price { get; set; }
            public DateTime DateOrderOpened { get; set; }
            public DateTime DateOrderClosed { get; set; }
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
                var client =  await _context.Contacts.FindAsync(request.ClientId);
                var orderCount = _context.Orders.Count();

                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = orderCount++,
                    ClientId = request.ClientId,
                    Client = client,
                    Type = request.Type,
                    Closed = request.Closed,
                    Product = request.Product,
                    Amount = request.Amount,
                    Price = request.Price,
                    DateOrderOpened = request.DateOrderOpened,
                    DateOrderClosed = request.DateOrderClosed,
                    Notes = request.Notes,
                };

                _context.Orders.Add(order);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}