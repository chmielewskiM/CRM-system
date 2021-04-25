using System;

namespace Domain
{
    public class Lead
    {
        public DateTime LastOperationDate { get; set; }
        public virtual Contact Contact { get; set; }
        public virtual Order Order { get; set; }

    }
}
