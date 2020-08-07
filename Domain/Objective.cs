using System;

namespace Domain
{
    public class Objective
    {
        public Guid Id { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string Assignation { get; set; }
        public DateTime Deadline { get; set; }
    }
}