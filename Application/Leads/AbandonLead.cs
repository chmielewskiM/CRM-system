using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Leads
{
    public class AbandonLead
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public bool SaveContact { get; set; }
            public bool KeepRecords { get; set; }
            public Command(Guid id, bool saveContact, bool keepRecords)
            {
                KeepRecords = keepRecords;
                SaveContact = saveContact;
                Id = id;
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
                IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == contact.Id);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                                x.UserName == _userAccessor.GetLoggedUsername());

                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { contact = "Not found" });


                foreach (SaleProcess process in saleProcess)
                {

                    if (!request.KeepRecords)
                    {
                        _context.SaleProcess.Remove(process);
                        _context.UserOperations.Remove(process.Operation.UserOperation);
                        _context.Operations.Remove(process.Operation);

                    }
                    else _context.SaleProcess.Remove(process);
                }

                if (request.SaveContact)
                    contact.Status = "Inactive";
                else
                {
                    var userContact = await _context.UserContacts.FindAsync(new Guid(user.Id), contact.Id);
                    _context.UserContacts.Remove(userContact);
                    _context.Remove(contact);
                }


                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}