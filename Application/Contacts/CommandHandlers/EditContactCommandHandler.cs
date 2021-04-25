using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System;

namespace Application.Contacts.CommandHandlers
{
    public class EditContactCommandHandler : IRequestHandler<EditContactCommand>
    {
        private readonly DataContext _context;

        public EditContactCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(EditContactCommand request, CancellationToken cancellationToken)
        {
            request.Contact.Name = request.Name;
            request.Contact.Type = request.Type;
            request.Contact.Company = request.Company;
            request.Contact.PhoneNumber = request.PhoneNumber;
            request.Contact.Email = request.Email;
            request.Contact.Notes = request.Notes;
            request.Contact.Source = request.Source;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}