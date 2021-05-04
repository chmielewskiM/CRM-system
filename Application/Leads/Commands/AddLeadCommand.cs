using System;
using Application.Contacts;
using Application.Leads.ViewModels;
using Domain;
using MediatR;

namespace Application.Leads.Commands
{
    public class AddLeadCommand : IRequest
    {
        public User User;
        public Contact Contact = new Contact();

        public AddLeadCommand(User user, string name, string company, string phoneNumber, string email, string notes, string source)
        {
            User = user;
            Contact.Name = name;
            Contact.Company = company;
            Contact.PhoneNumber = phoneNumber;
            Contact.Email = email;
            Contact.Notes = notes;
            Contact.Source = source;
        }
    }
}
