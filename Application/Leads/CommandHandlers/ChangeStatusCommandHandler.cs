using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Leads.Commands;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Leads.CommandHandlers
{
    public class ChangeStatusCommandHandler : IRequestHandler<ChangeStatusCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IOperationsRepository _operationsRepository;

        public ChangeStatusCommandHandler(DataContext context, IUserAccessor userAccessor, IOperationsRepository operationsRepository)
        {
            _operationsRepository = operationsRepository;
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Unit> Handle(ChangeStatusCommand request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

            //get operations which belong to the currently managed sale process
            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == request.Contact.Id);
            saleProcess = saleProcess.OrderByDescending(x => x.Index);

            //select sale process element with highest index (containing the most recent operation in chain)
            var lastProcess = saleProcess.First();
            string[] statuses = { "Inactive", "Lead", "Opportunity", "Quote", "Invoice" };

            //get index of the current lead's status
            int index = Array.FindIndex(statuses, x => x == request.Contact.Status);

            if (!request.Upgrade)
            {
                index--;

                await DowngradeLead(lastProcess, user);

                request.Contact.Status = statuses[index];
            }
            else if (request.Upgrade && index < statuses.Length - 1)
            {
                index++;
                request.Contact.Status = statuses[index];

                await UpgradeLead(lastProcess, statuses[index], request.Contact, user);

            }
            else if (request.Upgrade && index == statuses.Length - 1)
            {
                request.Contact.Status = statuses[0];
                request.Contact.SuccessfulDeals++;

                await ConvertLead(saleProcess, request.Contact, user);
            }

            _context.Contacts.Update(request.Contact);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }

        private async Task DowngradeLead(SaleProcess lastProcess, User user)
        {
            Operation previousOperation = lastProcess.Operation;

            await _operationsRepository.Delete(previousOperation.Date, user.Id);

            _context.SaleProcess.Remove(lastProcess);


        }
        private async Task UpgradeLead(SaleProcess lastProcess, string upgradeTo, Contact contact, User user)
        {
            var newOperation = new Operation();

            switch (upgradeTo)
            {
                case "Opportunity":
                    newOperation.Opportunity = true;
                    break;
                case "Quote":
                    newOperation.Quote = true;
                    break;
                case "Invoice":
                    newOperation.Invoice = true;
                    break;
            }
            newOperation.Date = DateTime.Now;

            await _operationsRepository.Add(newOperation, user);

            var newProcess = new SaleProcess
            {
                Operation = newOperation,
                OperationId = newOperation.Id,
                Contact = contact,
                ContactId = contact.Id,
                OrderId = lastProcess.OrderId ?? null,
                Index = lastProcess.Index + 1
            };

            await _context.SaleProcess.AddAsync(newProcess);

        }
        private async Task ConvertLead(IQueryable<SaleProcess> saleProcess, Contact contact, User user)
        {
            var operation = new Operation();
            Order order = contact.Orders.OrderByDescending(x => x.DateOrderOpened).FirstOrDefault();

            operation.Conversion = true;
            operation.Revenue = order.Price;
            operation.Date = DateTime.Now;

            await _operationsRepository.Add(operation, user);

            _context.SaleProcess.RemoveRange(saleProcess);
        }
    }
}