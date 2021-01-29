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

namespace Application.DelegatedTasks
{
    public class List
    {
        public class Query : IRequest<List<DelegatedTaskDTO>>
        {
            // public DateTime? Deadline { get; set; }
            // public Query(DateTime? deadline)
            // {
            //     Deadline = deadline;
            // }
        }
        public class Handler : IRequestHandler<Query, List<DelegatedTaskDTO>>
        {
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<List<DelegatedTaskDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                // var queryable = _context.DelegatedTasks
                //     .Where(x => x.Deadline >= request.Deadline)
                //     .OrderBy(x => x.Deadline)
                //     .AsQueryable();
                // try
                // {
                //     for (var i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(10, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (Exception ex) when (ex is TaskCanceledException)
                // {
                //     _logger.LogInformation("Task was cancelled");
                // }
                // var delegatedTasks = await _context.DelegatedTasks.ToListAsync();

                // return delegatedTasks;
                var tasks = await _context.DelegatedTasks
                .ToListAsync();
                var tasksAssignedToUser = new List<DelegatedTask>();
                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                if (user.Level == "top")
                    return _mapper.Map<List<DelegatedTask>, List<DelegatedTaskDTO>>(tasks);

                foreach (var task in tasks)
                {
                    var userHasTask = await _context.UserTasks.SingleOrDefaultAsync(x => x.DelegatedTaskId == task.Id && x.UserId == user.Id);
                    if (userHasTask != null)
                        tasksAssignedToUser.Add(task);
                }

                return _mapper.Map<List<DelegatedTask>, List<DelegatedTaskDTO>>(tasksAssignedToUser);
            }
        }
    }
}