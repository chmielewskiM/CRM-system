using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Application.Errors;
using System.Net;
using Application.Leads.Commands;

namespace Application.Leads.CommandHandlers
{
    public class AddLeadCommandHandler : IRequestHandler<AddLeadCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IOperationsRepository _operationsRepository;

        public AddLeadCommandHandler(DataContext context, IOperationsRepository operationsRepository, IUserAccessor userAccessor)
        {
            _operationsRepository = operationsRepository;
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Unit> Handle(AddLeadCommand request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

            var contact = new Contact
            {
                Id = Guid.NewGuid(),
                Name = request.Contact.Name,
                Type = "Client",
                Company = request.Contact.Company,
                PhoneNumber = request.Contact.PhoneNumber,
                DateAdded = DateTime.Now,
                Email = request.Contact.Email,
                Notes = request.Contact.Notes,
                Status = "Lead",
                Source = request.Contact.Source,
                Premium = false,
                SuccessfulDeals = 0
            };

            _context.Contacts.Add(contact);

            var userAccess = new UserContact
            {
                Id = Guid.NewGuid(),
                User = user,
                UserId = user.Id,
                Contact = contact,
                ContactId = contact.Id,
                DateAdded = request.Contact.DateAdded
            };

            _context.UserContacts.Add(userAccess);

            var operation = new Operation();

            operation.Lead = true;
            operation.Source = request.Contact.Source;
            operation.Date = contact.DateAdded;

            var saveOperation = await _operationsRepository.Add(operation, user);
            if (!saveOperation)
                throw new Exception("Problem saving changes");

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
