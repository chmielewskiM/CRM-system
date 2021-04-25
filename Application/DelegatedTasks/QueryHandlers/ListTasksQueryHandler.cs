
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

namespace Application.DelegatedTasks.QueryHandlers
{
    public class ListTasksQueryHandler : IRequestHandler<ListTasksQuery, (List<DelegatedTask>, int)>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly ILogger<ListTasksQueryHandler> _logger;

        public ListTasksQueryHandler(DataContext context, IUserAccessor userAccessor, ILogger<ListTasksQueryHandler> logger)
        {
            _logger = logger;
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<(List<DelegatedTask>, int)> Handle(ListTasksQuery request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetLoggedUser();

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
                userTasks.RemoveAll(x => x.SharedWithId == null || x.CreatedById != user.Id);
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

            return (tasks, tasksCount);
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