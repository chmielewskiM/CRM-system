using System;
using MediatR;

namespace Application.Orders
{
    public class AddOrderCommand : IRequest
    {
        public Guid? ClientId { get; set; }
        public Boolean Type { get; set; }
        public string Product { get; set; }
        public Double Amount { get; set; }
        public Double Price { get; set; }
        public string Notes { get; set; }

        public AddOrderCommand(Guid? clientId, bool type, string product, double amount, double price, string notes)
        {
            ClientId = clientId;
            Type = type;
            Product = product;
            Amount = amount;
            Price = price;
            Notes = notes;
        }
    }
}