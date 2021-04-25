using System;
using Domain;
using MediatR;

namespace Application.Orders.Commands
{
    public class CloseOrderCommand : IRequest
    {
        public Order Order { get; }

        public CloseOrderCommand(Order order)
        {
            Order = order;
        }
    }
}
