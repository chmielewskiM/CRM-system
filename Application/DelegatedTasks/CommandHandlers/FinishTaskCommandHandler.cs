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
            var finishedBy = _userAccessor.GetLoggedUsername();

            request.Task.Accepted = false;
            request.Task.Refused = false;
            request.Task.FinishedBy = finishedBy;
            request.Task.Pending = false;
            request.Task.Done = true;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");

        }
    }
}