using System.Collections.Generic;

namespace Application.DelegatedTasks
{
    public class CompleteTaskData
    {
        public List<DelegatedTaskDTO> Tasks { get; set; }
        public int TasksCount { get; set; }

        public CompleteTaskData(List<DelegatedTaskDTO> tasks, int tasksCount)
        {
            Tasks = tasks;
            TasksCount = tasksCount;
        }
    }
}