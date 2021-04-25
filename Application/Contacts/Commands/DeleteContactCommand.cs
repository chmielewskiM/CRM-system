using Domain;
using MediatR;

namespace Application.Contacts.Commands
{
    public class DeleteContactCommand : IRequest
    {
        public Contact Contact { get; }

        public DeleteContactCommand(Contact contact)
        {
            Contact = contact;
        }
    }
}
