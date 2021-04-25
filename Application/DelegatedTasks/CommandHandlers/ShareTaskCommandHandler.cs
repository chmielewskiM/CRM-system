using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
    public class ShareTaskCommandHandler : IRequestHandler<ShareTaskCommand>
    {
        private readonly DataContext _context;

        public ShareTaskCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(ShareTaskCommand request, CancellationToken cancellationToken)
        {

            var share = await _context
                .UserTasks
                .SingleOrDefaultAsync(x => x.DelegatedTaskId == request.Task.Id && x.SharedWith.Id == request.SharedById);

            request.Task.Accepted = false;
            request.Task.Refused = false;
            request.Task.Pending = true;

            share = await _context.UserTasks.SingleOrDefaultAsync(x => x.DelegatedTaskId == request.Task.Id);

            share.SharedWith = request.SharedWithUser;
            share.SharedWithId = request.SharedWithUser.Id;

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
                return Unit.Value;

            throw new System.Exception("Problem saving changes");
        }
    }
}