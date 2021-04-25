using System;
using Domain;
using MediatR;

namespace Application.Contacts.Commands
{
    public class AddContactCommand : IRequest
    {
        public string Name { get; }
        public string Type { get; }
        public string Company { get; }
        public string PhoneNumber { get; }
        public string Email { get; }
        public DateTime DateAdded { get; set; }
        public string Notes { get; }
        public string Status { get; set; }
        public Boolean Premium { get; set; }
        public int SuccessfulDeals { get; set; }

        public AddContactCommand(string name, string type, string company, string phoneNumber, string email, string notes)
        {
            Name = name;
            Type = type;
            Company = company;
            PhoneNumber = phoneNumber;
            DateAdded = DateTime.Now;
            Email = email;
            Notes = notes;
            Status = "Inactive";
            Premium = false;
            SuccessfulDeals = 0;
        }
    }
}
