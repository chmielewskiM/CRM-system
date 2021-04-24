
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Contacts.CommandHandlers
{
    public class StartSaleProcessCommandHandler : IRequestHandler<StartSaleProcessCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IOperationsRepository _operationsRepository;

        public StartSaleProcessCommandHandler(DataContext context, IUserAccessor userAccessor, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(StartSaleProcessCommand request, CancellationToken cancellationToken)
        {
            var contact = await _context.Contacts.FindAsync(request.Id);

            contact.Status = request.Status;

            var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

            var operation = new Operation();
            operation.Lead = true;
            operation.Source = "Former Client";
            operation.Date = DateTime.Now;

            await _operationsRepository.Add(operation, user);

            var saleProcess = new SaleProcess
            {
                Contact = contact,
                ContactId = contact.Id,
                Operation = operation,
                OperationId = operation.Id,
                OrderId = null,
                Index = 0
            };

            _context.SaleProcess.Add(saleProcess);

            contact.CurrentSale.Add(saleProcess);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}