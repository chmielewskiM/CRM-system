using System;
using System.Collections.Generic;

namespace Domain
{
    public class Operation
    {
        public Guid Id { get; set; }
        public bool Lead { get; set; }
        public bool Opportunity { get; set; }
        public bool Quote { get; set; }
        public bool Invoice { get; set; }
        public bool Conversion { get; set; }
        public bool Order { get; set; }
        public Double Revenue { get; set; }
        public string Source { get; set; }
        public DateTime Date { get; set; }
        public virtual UserOperation UserOperation { get; set; }
        public virtual SaleProcess CurrentSale { get; set; }
    }
}
