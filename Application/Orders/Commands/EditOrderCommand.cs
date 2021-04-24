using System;
using Domain;
using MediatR;

namespace Application.Orders.Commands
{
    public class EditOrderCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Product { get; set; }
        public Double Amount { get; set; }
        public Double Price { get; set; }
        public string Notes { get; set; }
        public EditOrderCommand(Guid id, string product, double amount, double price, string notes)
        {
            Id = id;
            Product = product;
            Amount = amount;
            Price = price;
            Notes = notes;
        }
    }
}
