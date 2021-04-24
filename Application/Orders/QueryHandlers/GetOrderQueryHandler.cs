using System.Threading;
using System.Threading.Tasks;
using Application.Orders.Queries;
using Domain;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class GetOrderQueryHandler : IRequestHandler<GetOrderQuery, Order>
    {
        private readonly DataContext _context;

        public GetOrderQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Order> Handle(GetOrderQuery request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(request.Id);

            return order;
        }
    }
}
