using System;

namespace Domain
{
    public class UserTask
    {
        public virtual User User { get; set; }
        public string UserId { get; set; }
        public virtual DelegatedTask DelegatedTask { get; set; }
        public Guid DelegatedTaskId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}