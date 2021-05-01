using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Errors;
using System.Net;
using AutoMapper;
using Application.Leads.Queries;
using System.Linq;
using System;

namespace Application.Leads.QueryHandlers
{
    public class LeadDetailsQueryHandler : IRequestHandler<LeadDetailsQuery, Lead>
    {
        private readonly DataContext _context;

        public LeadDetailsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Lead> Handle(LeadDetailsQuery request, CancellationToken cancellationToken)
        {
            Lead lead = new Lead();

            IQueryable<SaleProcess> saleProcess = _context.SaleProcess.Where(x => x.ContactId == request.Contact.Id);

            if (saleProcess.Count() == 0)
                throw new RestException(HttpStatusCode.NotFound, new { message = "This lead is not involved in any sale process." });

            saleProcess = saleProcess.OrderByDescending(x => x.Index);

            var lastProcess = saleProcess.First();

            lead.Contact = request.Contact;
            lead.LastOperationDate = lastProcess.Operation.Date;

            if (lastProcess.OrderId != null)
                lead.Order = await _context.Orders.FindAsync(new Guid(lastProcess.OrderId));
            else lead.Order = null;

            return lead;
        }
    }
}
