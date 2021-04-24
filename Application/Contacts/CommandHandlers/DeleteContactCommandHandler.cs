
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System;

namespace Application.Contacts.CommandHandlers
{
    public class DeleteContactCommandHandler : IRequestHandler<DeleteContactCommand>
    {
        private readonly DataContext _context;

        public DeleteContactCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteContactCommand request, CancellationToken cancellationToken)
        {
            //wybierać z bazy czy przekazać jakoś cały kontakt z kontrolera?
            var contact = await _context.Contacts.FindAsync(request.Id);

            _context.Contacts.Remove(contact);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}
