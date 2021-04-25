using System;
using Domain;
using MediatR;

namespace Application.Leads.Commands
{
    public class ChangeStatusCommand : IRequest
    {
        public Contact Contact { get; }
        public bool Upgrade { get; }

        public ChangeStatusCommand(Contact contact, bool upgrade)
        {
            Contact = contact;
            Upgrade = upgrade;
        }
    }
}
