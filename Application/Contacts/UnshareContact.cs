
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
////////////////////////////////////////////
//////
//////     Unshare is used for deleting UserContacts entities.
//////     User 'deletes' a contact (address book is based on UserContact entities),
//////     but in fact the contact is kept in DB.
//////     Only admin has access to 'deleted' contacts, he can restore them or remove them completely.
//////
////////////////////////////////////////////
namespace Application.Contacts
{
    public class UnshareContact
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                var contact = await _context
                    .Contacts
                    .FindAsync(request.Id);

                IQueryable<Order> orders = _context.Orders.AsQueryable();

                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Contact = "Could not find contact"
                    });

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                var share = await _context
                    .UserContacts
                    .SingleOrDefaultAsync(x => x.ContactId == contact.Id && x.UserId.Equals(new Guid(user.Id)));

                if (share == null)
                    return Unit.Value;

                if (!share.UserId.Equals(new Guid(user.Id)))
                    throw new RestException(HttpStatusCode.BadRequest, new { Share = "You cannot unshare this contact" });

                var hasOpenOrder = await orders.SingleOrDefaultAsync(x => x.UserId == user.Id && x.ClientId == contact.Id && x.Closed == false);
                
                if (hasOpenOrder != null)
                    throw new RestException(HttpStatusCode.FailedDependency, new
                    {
                        error = "The contact has an open order. Close or delete the order before deleting the contact."
                    });

                _context.UserContacts.Remove(share);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
    }
}