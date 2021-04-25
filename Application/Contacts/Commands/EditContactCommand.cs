using System;
using Domain;
using MediatR;

namespace Application.Contacts.Commands
{
    public class EditContactCommand : IRequest
    {
        public Contact Contact { get; }
        public string Name { get; }
        public string Type { get; }
        public string Company { get; }
        public string PhoneNumber { get; }
        public string Email { get; }
        public string Notes { get; }
        public string Source { get; }
        
        public EditContactCommand(Contact contact, string name, string type, string company, string phoneNumber, string email, string notes, string source)
        {
            Contact = contact;
            Name = name;
            Type = type;
            Company = company;
            PhoneNumber = phoneNumber;
            Email = email;
            Notes = notes;
            Source = source;
        }
    }
}
