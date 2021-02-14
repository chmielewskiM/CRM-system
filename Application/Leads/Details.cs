using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Domain;
using MediatR;
using Persistence;
using Application.Errors;
using System.Net;
using AutoMapper;

namespace Application.Leads
{
    public class Details
    {
        public class Query : IRequest<LeadDTO>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, LeadDTO>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<LeadDTO> Handle(Query request, CancellationToken cancellationToken)
            {
                var contact = await _context.Contacts
                .FindAsync(request.Id);

                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { contact = "Not found" });

                var contactToReturn = _mapper.Map<Contact, LeadDTO>(contact);

                return contactToReturn;
            }
        }
    }
}