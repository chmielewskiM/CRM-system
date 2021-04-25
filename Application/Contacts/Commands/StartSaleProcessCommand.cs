using Domain;
using MediatR;

namespace Application.Contacts.Commands
{
    public class StartSaleProcessCommand : IRequest
    {
        public Contact Contact { get; }

        public StartSaleProcessCommand(Contact contact)
        {
            Contact = contact;
        }
    }
}
