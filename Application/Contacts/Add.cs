using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;

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
            public string DateAdded { get; set; }
            public string Notes { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Type).NotEmpty();
                RuleFor(x => x.Company).NotEmpty();
                RuleFor(x => x.PhoneNumber).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
            }
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
                    Notes = request.Notes
                };

                _context.Contacts.Add(contact);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}