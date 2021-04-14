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

namespace Application.Contacts
{
    public class ContactDetails
    {
        public class Query : IRequest<ContactDTO>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ContactDTO>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<ContactDTO> Handle(Query request, CancellationToken cancellationToken)
            {
                var contact = await _context.Contacts
                .FindAsync(request.Id);

                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { contact = "Not found" });

                var contactToReturn = _mapper.Map<Contact, ContactDTO>(contact);

                return contactToReturn;
            }
        }
    }
}