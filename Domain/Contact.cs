using System;
using System.Collections.Generic;

namespace Domain
{
    public class Contact
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Company { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime DateAdded { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
        public Int16 SuccessfulDeals { get; set; }
        public Int16 UnsuccessfulDeals { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<UserContact> UserContacts { get; set; }

    }
}
