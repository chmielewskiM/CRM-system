using System;
using System.Collections.Generic;

namespace Domain
{
    public class Operation
    {
        public Guid Id { get; set; }
        public Int64 Lead { get; set; }
        public Int64 Opportunity { get; set; }
        public Int64 Quote { get; set; }
        public Int64 Invoice { get; set; }
        public Int64 Conversion { get; set; }
        public Int64 Order { get; set; }
        public Double Revenue { get; set; }
        public string Source { get; set; }
        public DateTime Date { get; set; }
        public virtual ICollection<UserOperation> UserOperations { get; set; }

    }
}
