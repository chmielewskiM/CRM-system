using System;
using Domain;
using MediatR;

namespace Application.Orders
{
    public class AddOrderCommand : IRequest
    {
        public Contact Client { get; }
        public Boolean Type { get; }
        public string Product { get; }
        public Double Amount { get; }
        public Double Price { get; }
        public string Notes { get; }

        public AddOrderCommand(Contact client, bool type, string product, double amount, double price, string notes)
        {
            Client = client;
            Type = type;
            Product = product;
            Amount = amount;
            Price = price;
            Notes = notes;
        }
    }
}