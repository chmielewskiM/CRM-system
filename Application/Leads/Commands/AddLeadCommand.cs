using System;
using Application.Contacts;
using Application.Leads.ViewModels;
using Domain;
using MediatR;

namespace Application.Leads.Commands
{
    public class AddLeadCommand : IRequest
    {
        public Contact Contact = new Contact();
        public AddLeadCommand(string name, string company, string phoneNumber, string email, string notes, string source)
        {
            Contact.Name = name;
            Contact.Company = company;
            Contact.PhoneNumber = phoneNumber;
            Contact.Email = email;
            Contact.Notes = notes;
            Contact.Source = source;
        }
    }
}
