using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class DeleteContactCommand : IRequest
    {
        public Guid Id { get; set; }

        public DeleteContactCommand(Guid id)
        {
            Id = id;
        }
    }
}
