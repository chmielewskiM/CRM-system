using System;

namespace Domain
{
    public class Call
    {
        public Guid Id { get; set; }
        public string DateCalled { get; set; }
        public Boolean Accepted { get; set; }
        public string Notes { get; set; }
        public Double Duration { get; set; }

    }
}
