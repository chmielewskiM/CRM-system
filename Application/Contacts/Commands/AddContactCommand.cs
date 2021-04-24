using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class AddContactCommand : IRequest
    {
        public Guid Id { get; }
        public string Name { get; }
        public string Type { get; }
        public string Company { get; }
        public string PhoneNumber { get; }
        public string Email { get; }
        public DateTime DateAdded { get; }
        public string Notes { get; }
        public string Status { get; }
        public Boolean Premium { get; }
        public Int16 SuccessfulDeals { get; }
        public AddContactCommand(Guid id, string name, string type, string company, string phoneNumber, string email, string notes)
        {
            Id = id;
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
