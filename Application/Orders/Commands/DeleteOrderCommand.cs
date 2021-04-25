using System;
using Domain;
using MediatR;

namespace Application.Orders.Commands
{
    public class DeleteOrderCommand : IRequest
    {
        public Contact Client { get; }
        public Order Order { get; }

        public DeleteOrderCommand(Contact client, Order order)
        {
            Client = client;
            Order = order;
        }
    }
}
