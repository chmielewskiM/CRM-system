using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class UnshareContactCommand : IRequest
    {
        public Guid Id { get; set; }
        public UnshareContactCommand(Guid id)
        {
            Id = id;
        }
    }
}
