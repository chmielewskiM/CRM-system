using System;
using Domain;
using MediatR;

namespace Application.Orders.Commands
{
    public class CloseOrderCommand : IRequest
    {
        public Guid Id { get; set; }
        public CloseOrderCommand(Guid id)
        {
            Id = id;
        }
    }
}
