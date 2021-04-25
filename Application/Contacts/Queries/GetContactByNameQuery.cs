using System;
using Domain;
using MediatR;

namespace Application.Contacts.Queries
{
    public class GetContactByNameQuery : IRequest<Contact>
    {
        public String Name { get; set; }
        public GetContactByNameQuery(String name)
        {
            Name = name;
        }
    }
}