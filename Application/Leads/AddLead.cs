using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Leads
{
    public class AddLead
    {
        public class Command : IRequest
        {
            public Lead Lead { get; set; }

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
                var guid = Guid.NewGuid();
                var contact = new Contact();
                var user = await _context.Users.SingleOrDefaultAsync(x =>
                            x.UserName == _userAccessor.GetLoggedUsername());

                if (request.Lead.Contact.Status.Equals(""))
                {
                    contact = new Contact
                    {
                        Id = Guid.NewGuid(),
                        Name = request.Lead.Contact.Name,
                        Type = "Client",
                        Company = request.Lead.Contact.Company,
                        PhoneNumber = request.Lead.Contact.PhoneNumber,
                        DateAdded = DateTime.Now,
                        Email = request.Lead.Contact.Email,
                        Notes = request.Lead.Contact.Notes,
                        Status = "Lead",
                        Source = request.Lead.Contact.Source,
                        Premium = false
                    };

                    _context.Contacts.Add(contact);

                    var userAccess = new UserContact
                    {
                        Id = Guid.NewGuid(),
                        User = user,
                        UserId = new Guid(user.Id),
                        Contact = contact,
                        ContactId = contact.Id,
                        DateAdded = request.Lead.Contact.DateAdded
                    };
                    _context.UserContacts.Add(userAccess);
                }

                else
                {
                    contact = await _context.Contacts.FindAsync(request.Lead.Contact.Id);
                    contact.Status = "Lead";
                }

                var newOperation = new Operations.Add();

                //***GUID check in case someone being afraid of drawing 1/2^128 scenario ;)
                // Operation checkGuid = null;
                // do
                // {
                //     newOperation.Id = Guid.NewGuid();
                //     checkGuid = await _contexts.FindAsync(newOperation.Id);
                // } while (checkGuid != null);

                newOperation.Lead++;
                newOperation.Source = request.Lead.Contact.Source;

                await newOperation.addOperation(newOperation, _context, user);

                var saleProcess = new SaleProcess
                {
                    Contact = contact,
                    ContactId = contact.Id,
                    Operation = newOperation,
                    OperationId = newOperation.Id,
                    Index = 0
                };

                _context.SaleProcess.Add(saleProcess);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}