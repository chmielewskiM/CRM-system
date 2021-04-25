using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
    public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand>
    {
        private readonly DataContext _context;

        public DeleteTaskCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var userTask = await _context
                .UserTasks
                .SingleOrDefaultAsync(x => x.DelegatedTaskId == request.Task.Id && x.CreatedBy.UserName == request.Username);

            if (userTask.CreatedById == null)
                return Unit.Value;

            _context.UserTasks.Remove(userTask);

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
                return Unit.Value;

            throw new System.Exception("Problem saving changes");
        }
    }
}