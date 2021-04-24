using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Errors;
using System.Net;
using AutoMapper;
using Application.Leads.ViewModels;
using Application.Leads.Queries;

namespace Application.Leads.QueryHandlers
{
    public class LeadDetailsQueryHandler : IRequestHandler<LeadDetailsQuery, Lead>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public LeadDetailsQueryHandler(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Lead> Handle(LeadDetailsQuery request, CancellationToken cancellationToken)
        {
            var contact = await _context.Contacts
            .FindAsync(request.Contact.Id);

            if (contact == null)
                throw new RestException(HttpStatusCode.NotFound,
                new { message = "Lead not found" });

            var lead = _mapper.Map<Contact, Lead>(contact);

            return lead;
        }
    }
}
