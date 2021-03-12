using System;

namespace Domain
{
    public class UserTask
    {
        public virtual User CreatedBy { get; set; }
        public string CreatedById { get; set; }
        public virtual User SharedWith { get; set; }
        public string SharedWithId { get; set; }
        public virtual DelegatedTask DelegatedTask { get; set; }
        public Guid DelegatedTaskId { get; set; }
        public DateTime DateAdded { get; set; }

    }
}