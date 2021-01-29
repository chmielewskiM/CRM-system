using System;

namespace Domain
{
    public class UserOperation
    {
        public virtual User User { get; set; }
        public string UserId { get; set; }
        public virtual Operation Operation { get; set; }
        public Guid OperationId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}