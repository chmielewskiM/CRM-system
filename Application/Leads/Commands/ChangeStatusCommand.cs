using System;
using Domain;
using MediatR;

namespace Application.Leads.Commands
{
    public class ChangeStatusCommand : IRequest
    {
        public Guid Id { get; set; }
        public bool Upgrade { get; set; }
        public ChangeStatusCommand(Guid id, bool upgrade)
        {
            Id = id;
            Upgrade = upgrade;
        }
    }
}
