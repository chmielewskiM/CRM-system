using System;
using Domain;
using MediatR;

namespace Application.Contacts.Queries
{
    public class ContactDetailsQuery : IRequest<Contact>
    {
        public Guid Id { get; set; }
        public ContactDetailsQuery(Guid id)
        {
            Id = id;
        }
    }
}
