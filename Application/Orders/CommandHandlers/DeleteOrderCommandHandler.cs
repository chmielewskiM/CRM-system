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

namespace Application.Orders.CommandHandlers
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
            //check whether the order is assigned to any sale process
            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.OrderId.Equals(request.Order.Id.ToString()));

            //erase the order from the whole sale process
            if (saleProcess.Count() > 0)
                foreach (SaleProcess process in saleProcess)
                    process.OrderId = null;

            await _operationsRepository.Delete(request.Order.DateOrderOpened, request.Order.UserId);

            _context.Remove(request.Order);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}
