using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Orders.Commands;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders.CommandHandlers
{
    public class CloseOrderCommandHandler : IRequestHandler<CloseOrderCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IOperationsRepository _operationsRepository;
        public CloseOrderCommandHandler(DataContext context, IUserAccessor userAccessor, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _context = context;
            _userAccessor = userAccessor;
        }
        public async Task<Unit> Handle(CloseOrderCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

            request.Order.Closed = true;
            request.Order.DateOrderClosed = DateTime.Now;

            //add revenue (only sale orders)
            if (request.Order.Type)
            {
                Operation operation = new Operation();

                operation.Revenue = request.Order.Price;

                await _operationsRepository.Add(operation, user);
            }

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}
