using System;

namespace Domain
{
    public class DelegatedTask
    {
        public Guid Id { get; set; }
        public string Assignment { get; set; }
        public string Type { get; set; }
        public DateTime Deadline { get; set; }
        public string Notes { get; set; }
        public Boolean Done { get; set; }

    }
}