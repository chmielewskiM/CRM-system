using System.Collections.Generic;

namespace Application.DelegatedTasks
{
    public class CompleteTasksDataViewModel
    {
        public List<DelegatedTaskViewModel> Tasks { get; set; }
        public int TasksCount { get; set; }

        public CompleteTasksDataViewModel(List<DelegatedTaskViewModel> tasks, int tasksCount)
        {
            Tasks = tasks;
            TasksCount = tasksCount;
        }
    }
}