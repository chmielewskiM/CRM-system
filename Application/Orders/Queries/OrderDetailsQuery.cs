using System;
using Domain;
using MediatR;

namespace Application.Orders.Queries
{
    public class OrderDetailsQuery : IRequest<Order>
    {
        public Guid Id { get; }
        
        public OrderDetailsQuery(Guid id)
        {
            Id = id;
        }
    }
}
