using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks
{
 public class RefuseTaskCommandHandler: IRequestHandler<RefuseTaskCommand>
        {
            private readonly DataContext _context;

            public RefuseTaskCommandHandler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(RefuseTaskCommand request, CancellationToken cancellationToken)
            {
                request.Task.Refused = true;
                request.Task.Accepted = false;
                request.Task.Pending = false;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
}