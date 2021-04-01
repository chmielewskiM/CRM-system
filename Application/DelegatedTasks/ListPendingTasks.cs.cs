using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.DelegatedTasks
{
    public class ListPendingTasks
    {
        public class Query : IRequest<CompleteTaskData>
        {
            public int PendingActivePage { get; set; }
            public int PendingPageSize { get; set; }
        }
        public class Handler : IRequestHandler<Query, CompleteTaskData>
        {
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            private readonly ILogger<ListTasks> _logger;

            public Handler(DataContext context, ILogger<ListTasks> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<CompleteTaskData> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context
                                    .Users
                                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetLoggedUsername());

                var userTasks = await _context.UserTasks.Where(x=>
                                                            x.SharedWith == user && 
                                                            x.DelegatedTask.Pending.Equals(true))
                                                            .OrderBy(x=>x.DelegatedTask.Deadline)
                                                            .ToListAsync();

                //get count of pending tasks shared with logged user
                int tasksCount = userTasks.Count();
                List<DelegatedTask> tasks = new List<DelegatedTask>();

                if (tasksCount > 0)
                {
                    var paginatedTasks = PaginatedList<UserTask>.Create(userTasks, request.PendingActivePage, request.PendingPageSize);

                    foreach (UserTask userTask  in paginatedTasks)
                        tasks.Add(userTask.DelegatedTask);
                } 
                        
                var pendingTasks = _mapper.Map<List<DelegatedTask>, List<DelegatedTaskDTO>>(tasks);
                
                return new CompleteTaskData(pendingTasks, tasksCount);
            }
        }
    }
}