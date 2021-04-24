using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DelegatedTasks
{
    public class FinishTaskCommandHandler : IRequestHandler<FinishTaskCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public FinishTaskCommandHandler(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Unit> Handle(FinishTaskCommand request, CancellationToken cancellationToken)
        {
            var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);
            var user = await _context.Users.SingleOrDefaultAsync(x =>
                           x.UserName == _userAccessor.GetLoggedUsername());

            delegatedTask.Accepted = false;
            delegatedTask.Refused = false;
            delegatedTask.FinishedBy = user.DisplayName;
            delegatedTask.Pending = false;
            delegatedTask.Done = true;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");

        }
    }
}