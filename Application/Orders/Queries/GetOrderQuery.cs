using System;
using Domain;
using MediatR;

namespace Application.Orders.Queries
{
    public class GetOrderQuery : IRequest<Order>
    {
        public Guid Id { get; set; }
        public GetOrderQuery(Guid id)
        {
            Id = id;
        }
    }
}
