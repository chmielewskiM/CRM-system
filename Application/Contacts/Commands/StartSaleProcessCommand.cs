using System;
using MediatR;

namespace Application.Contacts.Commands
{
    public class StartSaleProcessCommand : IRequest
    {
        public Guid Id {get;}
        public string Status = "Lead";
        public StartSaleProcessCommand(Guid id)
        {
            Id = id;
        }
    }
}
