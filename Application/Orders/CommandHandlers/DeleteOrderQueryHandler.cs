using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Orders.Commands;
using Domain;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand>
    {
        private readonly DataContext _context;
        private readonly IOperationsRepository _operationsRepository;

        public DeleteOrderCommandHandler(DataContext context, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _context = context;
        }

        public async Task<Unit> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(request.Id);

            if (order == null)
                throw new RestException(HttpStatusCode.NotFound, new { message = "Couldn't find the order." });

            Contact client = await _context.Contacts.FindAsync(order.ClientId);

            if (client == null)
                throw new RestException(HttpStatusCode.Conflict, new { message = "Something went wrong. The order appears to have no client assigned." });

            if (client.Status == "Invoice")
                throw new RestException(HttpStatusCode.Forbidden, new { message = "You can't delete an order which is waiting for finalization. Downgrade client's status first." });

            //check whether the order is assigned to any sale process
            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.OrderId.Equals(order.Id.ToString()));

            //erase the order from the whole sale process
            if (saleProcess.Count() > 0)
                foreach (SaleProcess process in saleProcess)
                    process.OrderId = null;

            await _operationsRepository.Delete(order.DateOrderOpened, new Guid(order.UserId));

            _context.Remove(order);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}
