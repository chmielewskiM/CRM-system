using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Contacts
{
    public class List
    {
        public class Query : IRequest<List<ContactDTO>> { }
        public class Handler : IRequestHandler<Query, List<ContactDTO>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<List<ContactDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var contacts = await _context.Contacts
                .ToListAsync();
                var contactsOwnedByUser = new List<Contact>();
                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                if (user.Level == "top")
                    return _mapper.Map<List<Contact>, List<ContactDTO>>(contacts);

                foreach (var contact in contacts)
                {
                    var userHasContact = await _context.UserContacts.SingleOrDefaultAsync(x => x.ContactId == contact.Id && x.UserId == user.Id);
                    if (userHasContact != null && userHasContact.Contact.Type != "Lead")
                        contactsOwnedByUser.Add(contact);
                }

                return _mapper.Map<List<Contact>, List<ContactDTO>>(contactsOwnedByUser);
            }
        }
    }
}