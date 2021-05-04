using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class UnshareContactCommand : IRequest
    {
        public Guid ContactId { get; }
        public string UserId { get; }

        public UnshareContactCommand(Guid contactId, string userId)
        {
            ContactId = contactId;
            UserId = userId;
        }
    }
}
