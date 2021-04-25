using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks
{
    public class AcceptTaskCommandHandler : IRequestHandler<AcceptTaskCommand>
    {
        private readonly DataContext _context;

        public AcceptTaskCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(AcceptTaskCommand request, CancellationToken cancellationToken)
        {
            request.Task.Accepted = true;
            request.Task.Pending = false;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}