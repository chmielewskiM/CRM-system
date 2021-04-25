using System;
using Domain;
using MediatR;

namespace Application.DelegatedTasks
{
    public class AddTaskCommand : IRequest
    {
        public string Type { get; }
        public DateTime DateStarted { get; set; }
        public DateTime Deadline { get; }
        public string Notes { get; }
        public Boolean Accepted { get; set; }
        public Boolean Refused { get; set; }
        public Boolean Pending { get; set; }
        public Boolean Done { get; set; }
        public string FinishedBy { get; set; }

        public AddTaskCommand(string type, DateTime deadline, string notes)
        {
            Type = type;
            Deadline = deadline;
            Notes = notes;
            DateStarted = DateTime.Now;
            Accepted = true;
            Refused = false;
            Pending = false;
            Done = false;
            FinishedBy = "";
        }
    }
}