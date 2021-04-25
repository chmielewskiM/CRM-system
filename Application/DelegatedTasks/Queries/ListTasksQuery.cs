
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class ListTasksQuery : IRequest<(List<DelegatedTask>, int)>
    {
        public bool MyTasks { get; }
        public bool Accepted { get; }
        public bool Refused { get; }
        public bool Done { get; }
        public bool SharedTasks { get; }
        public int? ActivePage { get; set; }
        public int? PageSize { get; }

        public ListTasksQuery(bool myTasks, bool sharedTasks, bool accepted, bool refused, bool done, int? activePage, int? pageSize)
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
}