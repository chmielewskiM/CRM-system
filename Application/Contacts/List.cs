using System;
using System.Collections.Generic;
using System.Linq;
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
                List<Contact> contacts = new List<Contact>();
                IQueryable<UserContact> userContacts = _context.UserContacts.Where(x => x.Contact.Status == "Inactive");

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                if (user.Level != "top")
                    userContacts = userContacts.Where(x => x.User == user);

                foreach (var userContact in userContacts)
                {
                    contacts.Add(userContact.Contact);
                }

                // contacts.AddRange(userContacts.Where(x=>x.Contact));
                return _mapper.Map<List<Contact>, List<ContactDTO>>(contacts);
            }
        }
    }
}