using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Leads.Queries;
using Application.Leads.ViewModels;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Leads.QueryHandlers
{
    public class ListLeadsQueryHandler : IRequestHandler<ListLeadsQuery, List<Lead>>
    {
        private readonly DataContext _context;
        private readonly ILogger<ListLeadsQueryHandler> _logger;

        public ListLeadsQueryHandler(DataContext context, ILogger<ListLeadsQueryHandler> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<List<Lead>> Handle(ListLeadsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<UserContact> userContacts = null;
            IQueryable<Order> orders = null;
            List<Lead> data = new List<Lead>();

            //query for leads (contacts with other than inactive status) which belong to logged user if user is not an admin, otherwise query all contacts
            if (request.UserLevel != "top")
            {
                userContacts = _context.UserContacts.Where(x => x.User.Id == request.UserId && x.Contact.Status != "Inactive");
            }
            else userContacts = _context.UserContacts.Where(x => x.Contact.Status != "Inactive");

            //don't proceed and return empty list if there are no leads
            if (userContacts == null)
                return new List<Lead>();

            orders = _context.Orders.Where(x => x.Closed == false);

            if (request.AllLeads == false)
            {
                userContacts = filterLeads(userContacts, request.Status);
            }

            foreach (UserContact userContact in userContacts)
            {

                if (userContact.Contact.CurrentSale.Count() > 0)
                {
                    Order order = null;

                    if (userContact.Contact.CurrentSale.Last().OrderId != null)
                    {
                        order = await _context.Orders.FindAsync(new Guid(userContact.Contact.CurrentSale.Last().OrderId));
                    }

                    data.Add(new Lead
                    {
                        Contact = userContact.Contact,
                        Order = order,
                        LastOperationDate = userContact.Contact.CurrentSale.Last().Operation.Date
                    });
                }
                else data.Add(new Lead
                {
                    Contact = userContact.Contact,
                    Order = null,
                });
            }

            data = sortLeads(data, request.SortBy);

            return data;
        }

        private static IQueryable<UserContact> filterLeads(IQueryable<UserContact> userContacts, string status)
        {
            //queries for leads with particular status, in case status is 'Invoice' a lead has an active order
            switch (status)
            {
                case "lead":
                    userContacts = userContacts
                    .Where(x => x.Contact.Status == "Lead");
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
                list = list.OrderByDescending(x => x.LastOperationDate).ToList();
            else if (sortBy == "name")
                list = list.OrderBy(x => x.Contact.Name).ToList();

            return (list);
        }
    }
}
