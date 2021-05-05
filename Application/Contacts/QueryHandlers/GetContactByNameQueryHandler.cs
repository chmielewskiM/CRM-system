using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Contacts.Queries;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.QueryHandlers
{
    public class GetContactByNameQueryHandler : IRequestHandler<GetContactByNameQuery, Contact>
    {
        private readonly DataContext _context;

        public GetContactByNameQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Contact> Handle(GetContactByNameQuery request, CancellationToken cancellationToken)
        {
            var name = request.Name.Replace("%20", " ");

            return await _context.Contacts.SingleOrDefaultAsync(u => u.Name == name, cancellationToken);
        }
    }
}