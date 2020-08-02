using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;

namespace Application.Orders
{
    public class Add
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
                var order = new Order
                {
                    Id = request.Id,
                    Client = request.Client,
                    Product = request.Product,
                    Amount = request.Amount,
                    Price = request.Price,
                    DateOrderOpened = request.DateOrderOpened,
                    Deadline = request.Deadline,
                    DateOrderClosed = request.DateOrderClosed,
                    Notes = request.Notes,
                };

                _context.Orders.Add(order);
                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Unit.Value;

                throw new Exception ("Problem saving changes");
            }
        }
    }
}