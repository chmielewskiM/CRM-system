using System.Threading;
using System.Threading.Tasks;
using Application.Contacts.Queries;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Contacts.QueryHandlers
{
    public class ContactDetailsQueryHandler : IRequestHandler<ContactDetailsQuery, Contact>
    {
        private readonly DataContext _context;

        public ContactDetailsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public Task<Contact> Handle(ContactDetailsQuery request, CancellationToken cancellationToken)
        {
            return _context.Contacts.SingleOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        }
    }
}