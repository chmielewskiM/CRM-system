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
    public class ListTasks
    {
        public class Query : IRequest<CompleteTaskData>
        {
            public bool MyTasks { get; set; }
            public bool Accepted { get; set; }
            public bool Refused { get; set; }
            public bool Done { get; set; }
            public bool Pending { get; set; }
            public Query(bool myTasks, bool accepted, bool refused, bool pending, bool done)
            {
                MyTasks = myTasks;
                Accepted = accepted;
                Refused = refused;
                Pending = pending;
                Done = done;
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

                //get count of pending tasks shared with logged user
                int pendingTasksCount = userTasks.Where(x => x.SharedWith == user && x.DelegatedTask.Pending.Equals(true)).Count();

                //select tasks
                //created by current user, admin can see all tasks
                if (request.MyTasks.Equals(true) && user.Level != "top")
                {
                    userTasks.RemoveAll(x => x.CreatedById != user.Id && !x.DelegatedTask.Pending);
                }
                //shared tasks
                else if (request.MyTasks.Equals(false) && user.Level != "top")
                {
                    userTasks.RemoveAll(x => x.SharedWith == null);
                }

                //remove done or open tasks
                if (request.Done.Equals(false))
                {
                    userTasks.RemoveAll(x => x.DelegatedTask.Done == true);

                }
                else userTasks.RemoveAll(x => x.DelegatedTask.Done == false);

                //filter open tasks
                userTasks = filterByCurrentState(userTasks, user, request.Accepted, request.Refused, request.Pending, request.Done);

                List<DelegatedTask> tasks = new List<DelegatedTask>();

                foreach (UserTask userTask in userTasks)
                {
                    tasks.Add(userTask.DelegatedTask);
                }

                var filteredTasks = _mapper.Map<List<DelegatedTask>, List<DelegatedTaskDTO>>(tasks);
                return new CompleteTaskData(filteredTasks, pendingTasksCount);
            }

            static List<UserTask> filterByCurrentState(List<UserTask> tasks, User user, bool accepted, bool refused, bool pending, bool done)
            {
                var sortedTasks = tasks.AsQueryable();

                if (accepted)
                {
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Accepted.Equals(true));
                }
                else if (refused)
                {
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Refused.Equals(true));
                }
                else if (pending)
                {
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Pending.Equals(true) && x.SharedWith == user);
                }
                else if (done)
                {
                    sortedTasks = sortedTasks.Where(x => x.DelegatedTask.Done.Equals(true));
                }

                if (user.Level == "low")
                    sortedTasks = sortedTasks.Where(x => x.CreatedBy == user || x.SharedWith == user);
                else if (user.Level == "mid")
                    sortedTasks = sortedTasks.Where(x => x.CreatedBy == user || !x.SharedWith.Equals(""));

                tasks = sortedTasks.ToList();

                return tasks;
            }
        }
    }
}