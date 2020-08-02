using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Domain;
using MediatR;
using Persistence;
using Application.Errors;
using System.Net;

namespace Application.Contacts
{
    public class Details
    {
        public class Query : IRequest<Contact>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Contact>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Contact> Handle(Query request, CancellationToken cancellationToken)
            {
                var contact = await _context.Contacts.FindAsync(request.Id);

                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { contact = "Not found" });

                return contact;
            }
        }
    }
}