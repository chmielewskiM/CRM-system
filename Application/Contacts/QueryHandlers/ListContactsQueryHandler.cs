using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common;
using Application.Contacts;
using Application.Interfaces;
using Application.Contacts.Queries;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Contacts.QueryHandlers
{
    public class ListContactsQueryHandler : IRequestHandler<ListContactsQuery, (List<Contact>, int)>
    {
        private readonly DataContext _context;
        private readonly ILogger<ListContactsQueryHandler> _logger;
        private readonly IUserAccessor _userAccessor;

        public ListContactsQueryHandler(DataContext context, ILogger<ListContactsQueryHandler> logger, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _logger = logger;
            _context = context;
        }

        public async Task<(List<Contact>, int)> Handle(ListContactsQuery request, CancellationToken cancellationToken)
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
                userContacts = userContacts.Where(x => !x.Contact.Orders.Any(x => (x.Closed == false && x.Type == true)));

                foreach (var userContact in userContacts)
                {
                    contacts.Add(userContact.Contact);
                }
            }
            return (contacts, total);
        }
    }
}