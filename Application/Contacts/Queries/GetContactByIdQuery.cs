using System;
using Domain;
using MediatR;

namespace Application.Contacts.Queries
{
    public class GetContactByIdQuery : IRequest<Contact>
    {
        public Guid Id { get; set; }
        public GetContactByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}