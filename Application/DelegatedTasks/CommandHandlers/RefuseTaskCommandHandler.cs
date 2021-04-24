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
                var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);

                delegatedTask.Refused = true;
                delegatedTask.Accepted = false;
                delegatedTask.Pending = false;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
}