using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
    public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public DeleteTaskCommandHandler(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
        {
            var delegatedTask = await _context
                .DelegatedTasks
                .FindAsync(request.Id);
                
            var user = await _context
                .Users
                .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

            var share = await _context
                .UserTasks
                .SingleOrDefaultAsync(x => x.DelegatedTaskId == delegatedTask.Id && x.CreatedBy.Id == user.Id);

            if (share == null)
                return Unit.Value;

            _context.UserTasks.Remove(share);

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
                return Unit.Value;

            throw new System.Exception("Problem saving changes");
        }
    }
}