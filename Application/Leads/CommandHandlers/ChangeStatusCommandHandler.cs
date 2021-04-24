using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Leads.Commands;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(ChangeStatusCommand request, CancellationToken cancellationToken)
        {   
            var contact = await _context.Contacts.FindAsync(request.Id);
            var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetLoggedUsername());

            //get operations which belong to the currently managed sale process
            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == contact.Id);
            saleProcess = saleProcess.OrderByDescending(x => x.Index);

            //select sale process element with highest index (containing the most recent operation in chain)
            var lastProcess = saleProcess.First();
            string[] statuses = { "Inactive", "Lead", "Opportunity", "Quote", "Invoice" };

            //get index of the current lead's status
            int index = Array.FindIndex(statuses, x => x == contact.Status);
            //downgrade lead's status
            if (!request.Upgrade)
            {
                index--;

                //make sure whether index is not out of boundary
                if (index < 0)
                    throw new RestException(HttpStatusCode.BadRequest, new { message = "Can't downgrade inactive client" });

                //declare previous operation (there is only one, desired process left in saleProcess)

                await DowngradeLead(lastProcess, user);

                contact.Status = statuses[index];
            }
            else if (request.Upgrade && index < statuses.Length - 1)
            {
                index++;
                contact.Status = statuses[index];

                await UpgradeLead(lastProcess, statuses[index], contact, user);

            }
            else if (request.Upgrade && index == statuses.Length - 1)
            {
                contact.Status = statuses[0];
                await ConvertLead(saleProcess, contact, user);
            }

            _context.Contacts.Update(contact);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }

        private async Task DowngradeLead(SaleProcess lastProcess, User user)
        {
            Operation previousOperation = lastProcess.Operation;

            await _operationsRepository.Delete(previousOperation.Date, new Guid(user.Id));

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

            var newOperation = new Operation();

            Order order = contact.Orders.OrderByDescending(x => x.DateOrderOpened).FirstOrDefault();

            if (!order.Closed)
                throw new RestException(HttpStatusCode.Forbidden, new { message = "Please close the order before performing the conversion." });

            newOperation.Conversion = true;
            newOperation.Revenue = order.Price;
            newOperation.Date = DateTime.Now;
            await _operationsRepository.Add(newOperation, user);

            _context.SaleProcess.RemoveRange(saleProcess);
        }
    }
}