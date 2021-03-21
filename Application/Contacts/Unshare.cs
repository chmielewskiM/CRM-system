
using System;
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
//////     ***FEATURE NOT IMPLEMENTED ***
//////
////////////////////////////////////////////
namespace Application.Contacts
{
    public class Unshare
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
                    .SingleOrDefaultAsync(x => x.ContactId == contact.Id && x.UserId.Equals(user.Id));

                if (share == null)
                    return Unit.Value;

                if (!share.UserId.Equals(user.Id))
                    throw new RestException(HttpStatusCode.BadRequest, new { Share = "You cannot unshare this contact" });

                _context.UserContacts.Remove(share);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
    }
}