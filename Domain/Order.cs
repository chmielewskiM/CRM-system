using System;

namespace Domain
{
    public class Order
    {
        public Guid Id { get; set; }
        public int OrderNumber { get; set; }
        public Guid ClientId { get; set; }
        public virtual Contact Client { get; set; }
        public Boolean Type { get; set; }
        public Boolean Closed { get; set; }
        public string Product { get; set; }
        public Double? Amount { get; set; }
        public Double? Price { get; set; }
        public DateTime? DateOrderOpened { get; set; }
        public DateTime? DateOrderClosed { get; set; }
        public string Notes { get; set; }
    }
}
