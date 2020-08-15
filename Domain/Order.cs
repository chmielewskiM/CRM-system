using System;

namespace Domain
{
    public class Order
    {
        public Guid Id { get; set; }
        public string Client { get; set; }
        public Boolean Type { get; set; }
        public string Product { get; set; }
        public Double Amount { get; set; }
        public Double Price { get; set; }
        public DateTime DateOrderOpened { get; set; }
        public DateTime DateOrderClosed { get; set; }
        public string Notes { get; set; }
    }
}
