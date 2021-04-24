
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
                //Fluent validation
                // CommandValidator validator = new CommandValidator();
                // validator.ValidateAndThrow(request);

                var contact = await _context.Contacts.FindAsync(request.Id);

                // bool noChanges = (contact.Name == request.Name &&
                //                 contact.Type == request.Type &&
                //                 contact.Company == request.Company &&
                //                 contact.PhoneNumber == request.PhoneNumber &&
                //                 contact.DateAdded == contact.DateAdded &&
                //                 contact.Email == request.Email &&
                //                 contact.Notes == request.Notes &&
                //                 contact.Status == request.Status);

                // if (noChanges)
                //     throw new NoChangesException();

                contact.Name = request.Name ?? contact.Name;
                contact.Type = request.Type ?? contact.Type;
                contact.Company = request.Company ?? contact.Company;
                contact.PhoneNumber = request.PhoneNumber ?? contact.PhoneNumber;
                contact.Email = request.Email ?? contact.Email;
                contact.Notes = request.Notes ?? contact.Notes;
                contact.Source = request.Source ?? contact.Source;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
        }
    }
}