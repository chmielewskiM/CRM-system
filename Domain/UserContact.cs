using System;

namespace Domain
{
    public class UserContact
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public Contact Contact { get; set; }
        public Guid ContactId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}