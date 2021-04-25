using System;
using Domain;
using MediatR;

namespace Application.Orders.Commands
{
    public class EditOrderCommand : IRequest
    {
        public Order Order { get; }
        public string Product { get; }
        public Double Amount { get; }
        public Double Price { get; }
        public string Notes { get; }
        
        public EditOrderCommand(Order order, string product, double amount, double price, string notes)
        {
            Order = order;
            Product = product;
            Amount = amount;
            Price = price;
            Notes = notes;
        }
    }
}
