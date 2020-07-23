using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;

namespace Application.Contacts
{
    public class Add
    {
        public class Command : IRequest
        {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }             
        public string Company { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime DateAdded { get; set; }
        
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var contact = new Contact
                {
                    Id = request.Id,
                    Name = request.Name,
                    Type = request.Type,
                    Company = request.Company,
                    PhoneNumber = request.PhoneNumber,
                    DateAdded = request.DateAdded,
                    Email = request.Email,
                };

                _context.Contacts.Add(contact);
                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Unit.Value;

                throw new Exception ("Problem saving changes");
            }
        }
    }
}