using System;

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
        public string DateAdded { get; set; }
        public string Notes { get; set; }

    }
}
