using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class EditContactCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Company { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Notes { get; set; }
        public string Source { get; set; }
        public EditContactCommand(Guid id, string name, string type, string company, string phoneNumber, string email, string notes, string source)
        {
            Id = id;
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
