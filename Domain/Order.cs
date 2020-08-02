using System;

namespace Domain
{
    public class Order
    {
        public Guid Id { get; set; }
        public string Client { get; set; }
        public string Product { get; set; }
        public Double Amount { get; set; }
        public Double Price { get; set; }
        public string DateOrderOpened { get; set; }
        public string Deadline { get; set; }
        public string DateOrderClosed { get; set; }
        public string Notes { get; set; }

    }
}
