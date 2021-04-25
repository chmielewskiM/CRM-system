using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks
{
    public class EditTaskCommandHandler : IRequestHandler<EditTaskCommand>
    {
        private readonly DataContext _context;

        public EditTaskCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(EditTaskCommand request, CancellationToken cancellationToken)
        {
            request.Task.Type = request.Type;
            request.Task.Deadline = request.Deadline.AddHours(1);
            request.Task.Notes = request.Notes;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving changes");
        }
    }
}