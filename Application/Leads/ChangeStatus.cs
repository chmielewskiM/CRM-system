using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Leads
{
    public class ChangeStatus
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

            public bool Upgrade { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.Name).NotEmpty();
                // RuleFor(x => x.Type).NotEmpty();
                // RuleFor(x => x.Company).NotEmpty();
                // RuleFor(x => x.PhoneNumber).NotEmpty();
                // RuleFor(x => x.Email).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var contact = await _context.Contacts.FindAsync(request.Id);

                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { contact = "Not found" });

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
                        throw new RestException(HttpStatusCode.BadRequest, "Can't downgrade inactive client");

                    //declare previous operation (there is only one, desired process left in saleProcess)

                    await DowngradeLead(lastProcess, user);

                    contact.Status = statuses[index];
                }
                else if (request.Upgrade && index < statuses.Length - 1)
                {
                    index++;
                    contact.Status = statuses[index];

                    await UpgradeLead(lastProcess, statuses[index], contact, _context, user);

                }
                else if (request.Upgrade && index == statuses.Length - 1)
                {
                    contact.Status = statuses[0];
                    await ConvertLead(saleProcess, contact, _context, user);
                }

                _context.Contacts.Update(contact);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }

            private async Task DowngradeLead(SaleProcess lastProcess, User user)
            {
                Operation previousOperation = lastProcess.Operation;
                var userOperation = await _context.UserOperations.FindAsync(new Guid(user.Id), previousOperation.Id);
                _context.SaleProcess.Remove(lastProcess);
                _context.UserOperations.Remove(userOperation);
                _context.Remove(previousOperation);
            }
            private async Task UpgradeLead(SaleProcess lastProcess, string upgradeTo, Contact contact, DataContext context, User user)
            {
                var newOperation = new Operations.Add();

                switch (upgradeTo)
                {
                    case "Opportunity":
                        newOperation.Opportunity = 1;
                        break;
                    case "Quote":
                        newOperation.Quote = 1;
                        break;
                    case "Invoice":
                        newOperation.Invoice = 1;
                        break;

                }

                await newOperation.addOperation(newOperation, context, user);

                var newProcess = new SaleProcess
                {
                    Operation = newOperation,
                    OperationId = newOperation.Id,
                    Contact = contact,
                    ContactId = contact.Id,
                    OrderId = lastProcess.OrderId ?? null,
                    Index = lastProcess.Index + 1
                };

                await context.SaleProcess.AddAsync(newProcess);

            }
            private async Task ConvertLead(IQueryable<SaleProcess> saleProcess, Contact contact, DataContext context, User user)
            {

                var newOperation = new Operations.Add();

                Order order = contact.Orders.OrderByDescending(x => x.DateOrderOpened).FirstOrDefault();

                if (!order.Closed)
                    throw new RestException(HttpStatusCode.Forbidden, "Please close the order before performing the conversion.");

                newOperation.Conversion = 1;
                newOperation.Revenue = order.Price;

                await newOperation.addOperation(newOperation, context, user);

                context.SaleProcess.RemoveRange(saleProcess);
            }
        }
    }
}