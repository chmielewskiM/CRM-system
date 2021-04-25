using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks
{
    public class AddTaskCommandHandler : IRequestHandler<AddTaskCommand>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public AddTaskCommandHandler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Unit> Handle(AddTaskCommand request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

            var task = new DelegatedTask
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Deadline = request.Deadline,
                Notes = request.Notes,
                DateStarted = request.DateStarted,
                Accepted = request.Accepted,
                Refused = request.Refused,
                Pending = request.Pending,
                Done = request.Done,
                FinishedBy = request.FinishedBy
            };

            _context.DelegatedTasks.Add(task);

            var userAccess = new UserTask
            {
                CreatedBy = user,
                CreatedById = user.Id,
                SharedWith = null,
                DelegatedTask = task,
                DateAdded = request.DateStarted
            };

            _context.UserTasks.Add(userAccess);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}