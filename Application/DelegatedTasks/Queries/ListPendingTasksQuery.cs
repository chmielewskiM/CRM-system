using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class ListPendingTasksQuery : IRequest<(List<DelegatedTask>, int)>
    {
        public int PendingActivePage { get; set; }
        public int PendingPageSize { get; set; }
        public ListPendingTasksQuery(int pendingActivePage, int pendingPageSize)
        {
            PendingActivePage = pendingActivePage;
            PendingPageSize = pendingPageSize;
        }
    }
}