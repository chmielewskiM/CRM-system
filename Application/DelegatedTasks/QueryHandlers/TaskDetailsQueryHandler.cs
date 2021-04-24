using System.Threading;
using System.Threading.Tasks;
using Application.DelegatedTasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.DelegatedTasks.QueryHandlers
{
    public class TaskDetailsQueryHandler : IRequestHandler<TaskDetailsQuery, DelegatedTask>
    {
        private readonly DataContext _context;

        public TaskDetailsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<DelegatedTask> Handle(TaskDetailsQuery request, CancellationToken cancellationToken)
        {
            var delegatedTask = await _context.DelegatedTasks.FindAsync(request.Id);

            return delegatedTask;
        }
    }
}