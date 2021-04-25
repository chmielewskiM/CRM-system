
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using Domain;
using System;
using Application.Interfaces;

namespace Application.Contacts.CommandHandlers
{
    public class AddContactCommandHandler : IRequestHandler<AddContactCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public AddContactCommandHandler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Unit> Handle(AddContactCommand request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

            var contact = new Contact
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Type = request.Type,
                Company = request.Company,
                PhoneNumber = request.PhoneNumber,
                DateAdded = request.DateAdded,
                Email = request.Email,
                Notes = request.Notes,
                Status = request.Status,
                Premium = request.Premium,
                SuccessfulDeals = request.SuccessfulDeals
            };

            _context.Contacts.Add(contact);

            var userAccess = new UserContact
            {
                Id = Guid.NewGuid(),
                User = user,
                UserId = user.Id,
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