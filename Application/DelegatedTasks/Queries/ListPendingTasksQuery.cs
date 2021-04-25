using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class ListPendingTasksQuery : IRequest<(List<DelegatedTask>, int)>
    {
        public string UserId { get; }
        public int PendingActivePage { get; }
        public int PendingPageSize { get; }

        public ListPendingTasksQuery(string userId, int pendingActivePage, int pendingPageSize)
        {
            UserId = userId;
            PendingActivePage = pendingActivePage;
            PendingPageSize = pendingPageSize;
        }
    }
}