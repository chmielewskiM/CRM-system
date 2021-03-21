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

namespace Application.Leads
{
    public class ListLeads
    {
        public class Query : IRequest<List<LeadDTO>>
        {
            public bool AllLeads { get; set; }
            public string Status { get; set; }
            public string SortBy { get; set; }

            public Query(bool allLeads, string status, string sortBy)
            {
                AllLeads = allLeads;
                Status = status;
                SortBy = sortBy;
            }
        }
        public class Handler : IRequestHandler<Query, List<LeadDTO>>
        {
            private readonly DataContext _context;
            private readonly ILogger<ListLeads> _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<ListLeads> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<List<LeadDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<UserContact> userContacts = null;
                IQueryable<Order> orders = null;
                List<Lead> data = new List<Lead>();

                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                //query for leads (contacts with other than inactive status) which belong to logged user if user is not an admin, otherwise query all contacts
                if (user.Level != "top")
                {
                    userContacts = _context.UserContacts.Where(x => x.User == user && x.Contact.Status != "Inactive");
                }

                //don't proceed and return empty list if there are no leads
                if (userContacts == null)
                    return null;

                orders = _context.Orders.Where(x => x.Closed == false);

                if (request.AllLeads == false)
                {
                    userContacts = filterLeads(userContacts, user, request.Status);
                }
                foreach (UserContact userContact in userContacts)
                {
                    data.Add(new Lead
                    {
                        Contact = userContact.Contact,
                        Order = null,
                        LastOperation = userContact.Contact.CurrentSale.Last().Operation.Date
                    });
                }

                //add an active order
                if (request.Status == "Invoice" || request.AllLeads == true)
                    foreach (Order order in orders)
                    {
                        var lead = data.Find(x => x.Contact.Id == order.ClientId);
                        if (lead != null)
                            lead.Order = order;
                    }

                data = sortLeads(data, request.SortBy);

                return _mapper.Map<List<Lead>, List<LeadDTO>>(data);
            }

            private static IQueryable<UserContact> filterLeads(IQueryable<UserContact> userContacts, User user, string status)
            {
                //queries for leads with particular status, in case status is 'Invoice' a lead has an active order
                switch (status)
                {
                    case "lead":
                        userContacts = userContacts
                        .Where(x => x.Contact.Status == "Active");
                        break;
                    case "opportunity":
                        userContacts = userContacts
                        .Where(x => x.Contact.Status == "Opportunity");
                        break;
                    case "quote":
                        userContacts = userContacts
                        .Where(x => x.Contact.Status == "Quote");
                        break;
                    case "invoice":
                        userContacts = userContacts
                        .Where(x => x.Contact.Status == "Invoice");
                        break;

                }

                return (userContacts);
            }

            private static List<Lead> sortLeads(List<Lead> list, string sortBy)
            {
                if (sortBy == "date")
                    list = list.OrderByDescending(x => x.LastOperation).ToList();
                else if (sortBy == "name")
                    list = list.OrderBy(x => x.Contact.Name).ToList();

                return (list);
            }
        }
    }
}