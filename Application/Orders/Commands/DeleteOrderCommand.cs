using System;
using Domain;
using MediatR;

namespace Application.Orders.Commands
{
    public class DeleteOrderCommand : IRequest
    {
        public Guid Id { get; set; }
        public DeleteOrderCommand(Guid id)
        {
            Id = id;
        }
    }
}
