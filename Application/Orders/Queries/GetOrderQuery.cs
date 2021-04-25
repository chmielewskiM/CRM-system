using System;
using Domain;
using MediatR;

namespace Application.Orders.Queries
{
    public class GetOrderQuery : IRequest<Order>
    {
        public Guid Id { get; }
        
        public GetOrderQuery(Guid id)
        {
            Id = id;
        }
    }
}
