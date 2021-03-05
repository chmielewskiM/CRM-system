using System;
using System.Threading;
using System.Threading.Tasks;
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
                var order = await _context.Orders.FindAsync(request.Id);
                Console.WriteLine("LOL");
                if (order == null)
                    throw new Exception("Could not find order");


                order.Closed = true;

                order.DateOrderClosed = DateTime.Now;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}