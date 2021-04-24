
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System.Linq;
using Application.Errors;
using System.Net;
using Domain;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Contacts.CommandHandlers
{
    public class AddContactCommandHandler : IRequestHandler<AddContactCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public AddContactCommandHandler(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(AddContactCommand request, CancellationToken cancellationToken)
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
                Status = request.Status,
                Premium = request.Premium,
                SuccessfulDeals = request.SuccessfulDeals
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