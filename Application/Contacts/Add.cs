using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Contacts
{
    public class Add
    {
        public Add()
        {
        }

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
            public Boolean Premium { get; set; }

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
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
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
                    Notes = request.Notes,
                    Status = "Inactive",
                    Premium = false
                };

                _context.Contacts.Add(contact);

                var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetLoggedUsername());

                var userAccess = new UserContact
                {
                    Id = Guid.NewGuid(),
                    User = user,
                    UserId = new Guid(user.Id),
                    Contact = contact,
                    ContactId = contact.Id,
                    DateAdded = request.DateAdded
                };

                _context.UserContacts.Add(userAccess);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}