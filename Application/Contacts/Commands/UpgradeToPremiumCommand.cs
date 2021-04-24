using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class UpgradeToPremiumCommand : IRequest
    {
        public Guid Id { get; set; }
        public UpgradeToPremiumCommand(Guid id)
        {
            Id = id;
        }
    }
}
