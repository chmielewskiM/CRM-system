using System.Collections.Generic;

namespace Application.DelegatedTasks
{
    public class CompleteTaskData
    {
        public int PendingTasksCount { get; set; }
        public List<DelegatedTaskDTO> Tasks { get; set; }

        public CompleteTaskData(List<DelegatedTaskDTO> tasks, int pendingTasksCount)
        {
            Tasks = tasks;
            PendingTasksCount = pendingTasksCount;
        }
    }
}