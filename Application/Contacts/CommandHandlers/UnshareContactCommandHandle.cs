
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System.Linq;
using Application.Errors;
using System.Net;
using Domain;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Contacts.CommandHandlers
{
    public class UnshareContactCommandHandler : IRequestHandler<UnshareContactCommand>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public UnshareContactCommandHandler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;

                _context = context;
            }

            public async Task<Unit> Handle(UnshareContactCommand request, CancellationToken cancellationToken)
            {
                var contact = await _context
                    .Contacts
                    .FindAsync(request.Id);

                IQueryable<Order> orders = _context.Orders.AsQueryable();

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                var share = await _context
                    .UserContacts
                    .SingleOrDefaultAsync(x => x.ContactId == contact.Id && x.UserId.Equals(new Guid(user.Id)));

                if (share == null)
                    return Unit.Value;

                if (!share.UserId.Equals(new Guid(user.Id)))
                    throw new RestException(HttpStatusCode.BadRequest, new { message = "You cannot unshare this contact" });

                var hasOpenOrder = await orders.SingleOrDefaultAsync(x => x.UserId == user.Id && x.ClientId == contact.Id && x.Closed == false);

                if (hasOpenOrder != null)
                    throw new RestException(HttpStatusCode.FailedDependency, new
                    {
                        message = "The contact has an open order. Close or delete the order before deleting the contact."
                    });

                _context.UserContacts.Remove(share);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
}