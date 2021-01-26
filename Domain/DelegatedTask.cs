using System;
using System.Collections.Generic;

namespace Domain
{
    public class DelegatedTask
    {
        public Guid Id { get; set; }
        public string Assignment { get; set; }
        public string Type { get; set; }
        public DateTime DateStarted { get; set; }
        public DateTime Deadline { get; set; }
        public string Notes { get; set; }
        public Boolean Done { get; set; }
        public virtual ICollection<UserTask> UserTasks { get; set; }

    }
}