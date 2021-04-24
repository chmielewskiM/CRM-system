
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class ListTasksQuery : IRequest<(List<DelegatedTask>, int)>
    {
        public bool MyTasks { get; set; }
        public bool Accepted { get; set; }
        public bool Refused { get; set; }
        public bool Done { get; set; }
        public bool SharedTasks { get; set; }
        public int? ActivePage { get; set; }
        public int? PageSize { get; set; }
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