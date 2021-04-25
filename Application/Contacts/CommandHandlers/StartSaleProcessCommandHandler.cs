using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System;
using Application.Interfaces;
using Domain;

namespace Application.Contacts.CommandHandlers
{
    public class StartSaleProcessCommandHandler : IRequestHandler<StartSaleProcessCommand>
    {
        private readonly DataContext _context;
        private readonly IOperationsRepository _operationsRepository;
        private readonly IUserAccessor _userAccessor;

        public StartSaleProcessCommandHandler(DataContext context, IUserAccessor userAccessor, IOperationsRepository operationsRepository)
        {
            _userAccessor = userAccessor;
            _operationsRepository = operationsRepository;
            _context = context;
        }

        public async Task<Unit> Handle(StartSaleProcessCommand request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

            request.Contact.Status = "Lead";

            var operation = new Operation();
            operation.Lead = true;
            operation.Source = "Former Client";
            operation.Date = DateTime.Now;

            await _operationsRepository.Add(operation, user);

            var saleProcess = new SaleProcess
            {
                Contact = request.Contact,
                ContactId = request.Contact.Id,
                Operation = operation,
                OperationId = operation.Id,
                OrderId = null,
                Index = 0
            };

            _context.SaleProcess.Add(saleProcess);

            request.Contact.CurrentSale.Add(saleProcess);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}