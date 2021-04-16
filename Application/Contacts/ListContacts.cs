using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Contacts
{
    public class ListContacts
    {
        public class Query : IRequest<CompleteContactsData>
        {
            public bool InProcess { get; set; }
            public bool Premium { get; set; }
            public string OrderBy { get; set; }
            public int? ActivePage { get; set; }
            public int? PageSize { get; set; }
            public string FilterInput { get; set; }
            public bool Uncontracted { get; set; }
            public Query(bool inProcess, bool premium, string orderBy, int? activePage, int? pageSize, string filterInput, bool uncontracted)
            {
                Uncontracted = uncontracted;
                InProcess = inProcess;
                Premium = premium;
                OrderBy = orderBy;
                ActivePage = activePage + 1;
                PageSize = pageSize;
                FilterInput = filterInput;
            }
        }
        public class Handler : IRequestHandler<Query, CompleteContactsData>
        {
            private readonly DataContext _context;
            private readonly ILogger<ListContacts> _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<ListContacts> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<CompleteContactsData> Handle(Query request, CancellationToken cancellationToken)
            {
                List<Contact> contacts = new List<Contact>();
                IQueryable<UserContact> userContacts = _context.UserContacts;

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());
                if (user.Level != "top")
                    userContacts = userContacts.Where(x => x.User == user);
                if (request.InProcess)
                    userContacts = userContacts.Where(x => x.Contact.Status != "Inactive");
                else if (request.Premium)
                    userContacts = userContacts.Where(x => x.Contact.Premium == true);

                //select orders which contain given input
                if (!request.FilterInput.Equals("unfiltered"))
                {
                    userContacts = userContacts
                    .Where(x => x.Contact.Name.Contains(request.FilterInput)
                    || x.Contact.Company.Contains(request.FilterInput)
                    || x.Contact.Type.Contains(request.FilterInput)
                    || x.Contact.Email.Contains(request.FilterInput)
                    || x.Contact.PhoneNumber.Contains(request.FilterInput));
                }

                //sort orders in requested way
                switch (request.OrderBy)
                {
                    case "name_desc":
                        userContacts = userContacts.OrderByDescending(x => x.Contact.Name);
                        break;
                    case "name_asc":
                        userContacts = userContacts.OrderBy(x => x.Contact.Name);
                        break;
                    case "company_desc":
                        userContacts = userContacts.OrderByDescending(x => x.Contact.Company);
                        break;
                    case "company_asc":
                        userContacts = userContacts.OrderBy(x => x.Contact.Company);
                        break;
                    case "type_desc":
                        userContacts = userContacts.OrderByDescending(x => x.Contact.Type);
                        break;
                    case "type_asc":
                        userContacts = userContacts.OrderBy(x => x.Contact.Type);
                        break;
                    case "status_desc":
                        userContacts = userContacts.OrderByDescending(x => x.Contact.Status);
                        break;
                    case "status_asc":
                        userContacts = userContacts.OrderBy(x => x.Contact.Status);
                        break;
                    case "date_desc":
                        userContacts = userContacts.OrderByDescending(x => x.Contact.DateAdded);
                        break;
                    case "date_asc":
                        userContacts = userContacts.OrderBy(x => x.Contact.DateAdded);
                        break;
                };

                var total = await userContacts.CountAsync();

                if (userContacts.Count() > 0 && !request.Uncontracted)
                {
                    var paginatedContacts = PaginatedList<UserContact>.Create(userContacts, request.ActivePage ?? 1, request.PageSize ?? 3);

                    foreach (var userContact in paginatedContacts)
                    {
                        contacts.Add(userContact.Contact);
                    }
                }

                if (request.Uncontracted)
                {
                    userContacts = userContacts.Where(x => !x.Contact.Orders.Any(x => x.Closed == false));

                    foreach (var userContact in userContacts)
                    {
                        contacts.Add(userContact.Contact);
                    }
                }

                return new CompleteContactsData(_mapper.Map<List<Contact>, List<ContactDTO>>(contacts), total);
            }
        }
    }
}