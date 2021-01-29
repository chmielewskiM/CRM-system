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

namespace Application.Contacts
{
    public class Share
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
                    .SingleOrDefaultAsync(x => x.ContactId == contact.Id && x.UserId == user.Id);

                if (share != null)
                    throw new RestException(HttpStatusCode.BadRequest,
                    new { Assign = "Already shared to the contact" });

                share = new UserContact
                {
                    Contact = contact,
                    User = user,
                    DateAdded = DateTime.Now
                };

                _context.UserContacts.Add(share);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new System.Exception("Problem saving changes");
            }
        }
    }
}