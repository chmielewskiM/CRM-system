using System;

namespace Application.Orders.ViewModels
{
    public class OrderViewModel
    {
        public Guid Id { get; set; }
        public int OrderNumber { get; set; }
        public string ClientName { get; set; } 
        public Boolean Type { get; set; }
        public Boolean Closed { get; set; }
        public string Product { get; set; }
        public Double Amount { get; set; }
        public Double Price { get; set; }
        public DateTime DateOrderOpened { get; set; }
        public DateTime DateOrderClosed { get; set; }
        public string Notes { get; set; }
    }
}