using System;
using System.Collections.Generic;

namespace Domain
{
    public class SaleProcess
    {

        public virtual Contact Contact { get; set; }
        public Guid ContactId { get; set; }
        public virtual Operation Operation { get; set; }
        public Guid OperationId { get; set; }
        public int Index { get; set; }

    }
}