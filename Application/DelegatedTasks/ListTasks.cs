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
    public class ListTasks
    {
        public class Query : IRequest<CompleteTaskData>
        {
            public bool MyTasks { get; set; }
            public bool Accepted { get; set; }
            public bool Refused { get; set; }
            public bool Done { get; set; }
            public bool SharedTasks { get; set; }
            public int? ActivePage { get; set; }
            public int? PageSize { get; set; }
            public Query(bool myTasks, bool sharedTasks, bool accepted, bool refused, bool done, int? activePage, int? pageSize)
            {
                MyTasks = myTasks;
                SharedTasks = sharedTasks;
                Accepted = accepted;
                Refused = refused;
                Done = done;
                ActivePage = activePage + 1;
                PageSize = pageSize;
            }
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

                var userTasks = await _context.UserTasks
                .ToListAsync();

                ////select tasks
                //created by logged user, admin can see all tasks
                if (request.MyTasks.Equals(true)
                            && request.SharedTasks.Equals(false)
                            && user.Level != "top")
                    userTasks.RemoveAll(x => x.CreatedById != user.Id || x.SharedWith != null);
                //tasks shared by logged user
                else if (request.MyTasks.Equals(true)
                            && request.SharedTasks.Equals(true)
                            && user.Level != "top")
                    userTasks.RemoveAll(x => x.SharedWith == null || x.CreatedById != user.Id);
                //tasks shared with logged user 
                else if (request.MyTasks.Equals(false)
                            && request.SharedTasks.Equals(true)
                            && user.Level != "top")
                    userTasks.RemoveAll(x => x.SharedWith != user || x.CreatedById == user.Id);

                //remove done or open tasks
                if (request.Done.Equals(false))
                    userTasks.RemoveAll(x => x.DelegatedTask.Done == true);
                else userTasks.RemoveAll(x => x.DelegatedTask.Done == false);

                //filter open tasks
                userTasks = filterByCurrentState(userTasks, user, request.Accepted, request.Refused, request.Done);

                int tasksCount = userTasks.Count();

                List<DelegatedTask> tasks = new List<DelegatedTask>();
                if (tasksCount > 0)
                {
                    var paginatedTasks = PaginatedList<UserTask>.Create(userTasks, request.ActivePage ?? 1, request.PageSize ?? 3);

                    foreach (UserTask userTask in paginatedTasks)
                        tasks.Add(userTask.DelegatedTask);
                }

                var filteredTasks = _mapper.Map<List<DelegatedTask>, List<DelegatedTaskDTO>>(tasks);

                return new CompleteTaskData(filteredTasks, tasksCount);
            }

            static List<UserTask> filterByCurrentState(List<UserTask> tasks, User user, bool accepted, bool refused, bool done)
            {
                var sortedTasks = tasks.AsQueryable();

                if (accepted)
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Accepted.Equals(true));
                else if (refused)
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Refused.Equals(true));
                else if (done)
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Done.Equals(true));

                if (user.Level == "low")
                    sortedTasks = sortedTasks.Where(x => x.CreatedBy == user || x.SharedWith == user);
                else if (user.Level == "mid")
                    sortedTasks = sortedTasks.Where(x => x.CreatedBy == user || !x.SharedWith.Equals(""));

                sortedTasks = sortedTasks.OrderBy(x => x.DelegatedTask.Deadline);

                tasks = sortedTasks.ToList();

                return tasks;
            }
        }
    }
}