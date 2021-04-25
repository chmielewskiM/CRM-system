
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Contacts.Commands;
using System.Threading;
using System;

namespace Application.Contacts.CommandHandlers
{
    public class UpgradeToPremiumCommandHandler : IRequestHandler<UpgradeToPremiumCommand>
    {
        private readonly DataContext _context;

        public UpgradeToPremiumCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpgradeToPremiumCommand request, CancellationToken cancellationToken)
        {
            var contact = await _context.Contacts.FindAsync(request.Id);

            contact.Premium = !contact.Premium;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}
