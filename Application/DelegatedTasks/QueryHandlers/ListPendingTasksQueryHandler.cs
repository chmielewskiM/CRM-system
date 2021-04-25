
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.DelegatedTasks.Queries
{
    public class ListPendingTasksQueryHandler : IRequestHandler<ListPendingTasksQuery, (List<DelegatedTask>, int)>
    {
        private readonly DataContext _context;
        private readonly ILogger<ListPendingTasksQueryHandler> _logger;

        public ListPendingTasksQueryHandler(DataContext context, ILogger<ListPendingTasksQueryHandler> logger, IMapper mapper)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<(List<DelegatedTask>, int)> Handle(ListPendingTasksQuery request, CancellationToken cancellationToken)
        {
            var userTasks = await _context.UserTasks.Where(x =>
                                                        x.SharedWithId == request.UserId &&
                                                        x.DelegatedTask.Pending.Equals(true))
                                                        .OrderBy(x => x.DelegatedTask.Deadline)
                                                        .ToListAsync();

            //get count of pending tasks shared with logged user
            int tasksCount = userTasks.Count();
            List<DelegatedTask> tasks = new List<DelegatedTask>();

            if (tasksCount > 0)
            {
                foreach (UserTask userTask in userTasks)
                    tasks.Add(userTask.DelegatedTask);
            }

            return (tasks, tasksCount);
        }
    }
}