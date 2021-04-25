using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Orders.Queries;
using Domain;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class OrderDetailsQueryHandler : IRequestHandler<OrderDetailsQuery, Order>
    {
        private readonly DataContext _context;

        public OrderDetailsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Order> Handle(OrderDetailsQuery request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(request.Id);

            return order;
        }
    }
}
