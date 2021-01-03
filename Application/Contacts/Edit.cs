using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Contacts
{
    public class Edit
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
            public string Notes { get; set; }
            public string Status { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.Name).NotEmpty();
                // RuleFor(x => x.Type).NotEmpty();
                // RuleFor(x => x.Company).NotEmpty();
                // RuleFor(x => x.PhoneNumber).NotEmpty();
                // RuleFor(x => x.Email).NotEmpty();
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
                var contact = await _context.Contacts.FindAsync(request.Id);

                if (contact.Name == request.Name &&
                contact.Type == request.Type &&
                contact.Company == request.Company &&
                contact.PhoneNumber == request.PhoneNumber &&
                contact.DateAdded == contact.DateAdded &&
                contact.Email == request.Email &&
                contact.Notes == request.Notes &&
                contact.Status == request.Status)

                    throw new Exception("There were no changes");


                if (contact == null)
                    throw new RestException(HttpStatusCode.NotFound,
                    new { contact = "Not found" });

                contact.Name = request.Name ?? contact.Name;
                contact.Type = request.Type ?? contact.Type;
                contact.Company = request.Company ?? contact.Company;
                contact.PhoneNumber = request.PhoneNumber ?? contact.PhoneNumber;
                contact.DateAdded = contact.DateAdded;
                contact.Email = request.Email ?? contact.Email;
                contact.Notes = request.Notes ?? contact.Notes;
                contact.Status = request.Status ?? contact.Status;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}