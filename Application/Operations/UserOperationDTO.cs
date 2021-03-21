using System;
using Domain;

namespace Application.Operations
{
    public class UserOperationsDTO
    {
        public virtual User User { get; set; }
        public Guid UserId { get; set; }
        public virtual Operation Operation { get; set; }
        public Guid OperationId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}