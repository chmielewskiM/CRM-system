using System;
using System.Collections.Generic;

namespace Domain
{
    public class Lead
    {
        public DateTime LastOperation { get; set; }
        public virtual Contact Contact { get; set; }
        public virtual Order Order { get; set; }

    }
}
