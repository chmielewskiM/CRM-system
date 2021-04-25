using System;

namespace Domain
{
    public class UserContact
    {
        public Guid Id { get; set; }
        public virtual User User { get; set; }
        public string UserId { get; set; }
        public virtual Contact Contact { get; set; }
        public Guid ContactId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}